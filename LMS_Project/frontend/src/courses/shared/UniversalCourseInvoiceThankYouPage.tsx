"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, LayoutDashboard, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { fetchPaymentHistory } from "../../auth/api";
import type { PaymentRequestRecord } from "../../auth/types";
import { getCourseInvoiceConfig } from "./courseInvoiceConfig";

type UniversalCourseInvoiceThankYouPageProps = {
  courseSlug: string;
};

function getStatusCopy(payment?: PaymentRequestRecord | null) {
  if (!payment) {
    return {
      icon: Clock3,
      tone: "pending",
      kicker: "Payment status",
      title: "Waiting for payment request",
      body: "Your latest payment request is not available yet. If you just submitted, refresh in a moment.",
      status: "Current status: Not received yet",
    };
  }

  if (payment.invoiceStatus === "PAID") {
    return {
      icon: CheckCircle2,
      tone: "paid",
      kicker: "Payment received",
      title: "Payment approved",
      body: "Your invoice payment has been received and approved. Paid access can open the course directly.",
      status: "Current status: Paid",
    };
  }

  if (payment.invoiceStatus === "UNPAID") {
    return {
      icon: XCircle,
      tone: "unpaid",
      kicker: "Payment not approved",
      title: "Payment needs review",
      body: payment.reviewNotes || "Admin could not verify this payment. Please review your payment information and submit again if needed.",
      status: "Current status: Unpaid",
    };
  }

  return {
    icon: Clock3,
    tone: "pending",
    kicker: "Payment information sent",
    title: "Thank you",
    body: "Your course payment request has been submitted. Admin will receive and verify the invoice payment information.",
    status: "Current status: Pending review",
  };
}

export default function UniversalCourseInvoiceThankYouPage({
  courseSlug,
}: UniversalCourseInvoiceThankYouPageProps) {
  const config = getCourseInvoiceConfig(courseSlug);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStatus() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchPaymentHistory();
      setPaymentHistory(response.data);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to load payment status.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  const latestPayment = paymentHistory.find((payment) =>
    payment.planName.toLowerCase().includes(config.fallbackTitle.toLowerCase()),
  ) ?? paymentHistory[0] ?? null;
  const statusCopy = useMemo(() => getStatusCopy(latestPayment), [latestPayment]);
  const StatusIcon = loading ? RefreshCw : statusCopy.icon;
  const StatusBadgeIcon = statusCopy.icon;

  return (
    <main className={`invoice-thankyou-page invoice-thankyou-${statusCopy.tone}`}>
      <section className="invoice-thankyou-panel">
        <div className="invoice-thankyou-icon">
          <StatusIcon aria-hidden="true" className={loading ? "is-spinning" : undefined} />
        </div>

        <p className="invoice-thankyou-kicker">{loading ? "Checking payment" : statusCopy.kicker}</p>
        <h1>{loading ? "Checking status" : statusCopy.title}</h1>
        <p>{error ?? statusCopy.body}</p>

        <div className="invoice-thankyou-status">
          <StatusBadgeIcon aria-hidden="true" />
          <span>{error ? "Current status: Unable to load" : statusCopy.status}</span>
        </div>

        {latestPayment ? (
          <div className="invoice-thankyou-meta">
            <span>{`Invoice: ${latestPayment.invoiceNumber ?? "Pending invoice number"}`}</span>
            <span>{`Transaction: ${latestPayment.transactionId}`}</span>
            <span>{`Amount: ${latestPayment.amount} ${latestPayment.currency}`}</span>
          </div>
        ) : null}

        <div className="invoice-thankyou-actions">
          <Link href="/User/dashboard" className="invoice-thankyou-primary">
            <LayoutDashboard aria-hidden="true" />
            Go to Dashboard
          </Link>
          <button type="button" onClick={loadStatus} disabled={loading}>
            <RefreshCw aria-hidden="true" />
            Refresh Status
          </button>
          <Link href={config.courseHref}>
            Back to Course
          </Link>
        </div>
      </section>
    </main>
  );
}
