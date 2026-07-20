"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import CoursePurchaseInvoice from "../../CoursePurchaseInvoice";
import type { PaymentSubmission } from "../../CoursePurchaseInvoice";
import { createUpgradeRequest } from "../../auth/api";
import { useCourseSlugAccess } from "../../auth/useBasicsCourseAccess";
import { getCourseInvoiceConfig } from "./courseInvoiceConfig";

type UniversalCourseInvoicePageProps = {
  courseSlug: string;
};

const BDT_PER_USD = 122;
const FIXED_TAX_PERCENTAGE = 5;

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export default function UniversalCourseInvoicePage({
  courseSlug,
}: UniversalCourseInvoicePageProps) {
  const router = useRouter();
  const config = getCourseInvoiceConfig(courseSlug);
  const { loading, error, user, course, hasAccess, paymentHistory } = useCourseSlugAccess(courseSlug);

  const invoiceNumber = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    const buyerId = (user?.id ?? "003").slice(0, 6).toUpperCase();
    return `INV-${date}-${config.referencePrefix}-${buyerId}`;
  }, [config.referencePrefix, user?.id]);

  if (loading) {
    return <main className="invoice-page"><div className="invoice-loading">Preparing your invoice...</div></main>;
  }

  if (!user) {
    return <InvoiceMessage title="Login required" message="Log in before creating a course invoice." href="/login" action="Login to Continue" />;
  }

  if (!course) {
    return <InvoiceMessage title="Course unavailable" message={error ?? "This course is not available for enrollment."} href={config.courseHref} action="Return to Course" />;
  }

  if (hasAccess) {
    return <InvoiceMessage title="Your course is ready" message="No additional invoice is required." href={config.firstLessonHref} action="Open First Lesson" />;
  }

  if (user.accountState !== "FREE") {
    return <InvoiceMessage title="No payment required" message="Your account can request enrollment directly from the course page." href={config.courseHref} action="Return to Course" />;
  }

  const latestPayment = paymentHistory.find((payment) => payment.courseId === course.id) ?? paymentHistory[0];
  const paymentStatus = latestPayment?.invoiceStatus === "PAID"
    ? "Paid"
    : latestPayment?.invoiceStatus === "PENDING"
      ? "Pending"
      : "Unpaid";
  const courseAmountBdt = course.priceBdt > 0 ? course.priceBdt : config.fallbackAmountBdt;
  const coursePriceUsd = roundCurrency(courseAmountBdt / BDT_PER_USD);
  const taxAmountUsd = roundCurrency(coursePriceUsd * (FIXED_TAX_PERCENTAGE / 100));
  const totalAmountUsd = roundCurrency(coursePriceUsd + taxAmountUsd);

  async function savePayment(submission: PaymentSubmission) {
    const isInternational = submission.paymentMethod === "ACH" || submission.paymentMethod === "Wire Transfer";

    await createUpgradeRequest({
      planName: `${course.title} Course Access`,
      transactionId: submission.transactionId,
      paymentMethod: submission.paymentMethod,
      amount: isInternational ? totalAmountUsd : courseAmountBdt,
      currency: isInternational ? "USD" : "BDT",
      invoiceNumber,
      courseId: course.id,
      paymentReference: submission.paymentReference,
      buyerName: submission.buyerName,
      buyerEmail: submission.email || user.email,
      buyerPhone: submission.phone,
      additionalMessage: submission.additionalMessage,
    });

    window.setTimeout(() => {
      router.push(`${config.courseHref}/invoice/thank-you`);
    }, 600);
  }

  return (
    <CoursePurchaseInvoice
      courseBuyerName={user.fullName}
      courseName={course.title}
      invoiceNumber={invoiceNumber}
      invoiceDate={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      paymentStatus={paymentStatus}
      coursePriceUSD={coursePriceUsd}
      taxPercentage={FIXED_TAX_PERCENTAGE}
      taxAmountUSD={taxAmountUsd}
      totalAmountUSD={totalAmountUsd}
      bangladeshAmountBDT={courseAmountBdt}
      generalPaymentReference={`${config.referencePrefix}-${course.id.slice(0, 8).toUpperCase()}`}
      onPaymentSubmit={savePayment}
    />
  );
}

function InvoiceMessage({ title, message, href, action }: { title: string; message: string; href: string; action: string }) {
  return (
    <main className="invoice-page">
      <section className="invoice-auth-card">
        <span>ET LMS</span>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link href={href}>{action}</Link>
      </section>
    </main>
  );
}
