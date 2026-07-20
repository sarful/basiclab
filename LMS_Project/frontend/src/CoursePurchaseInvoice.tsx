"use client";

import React from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  Download,
  FileText,
  Globe2,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Send,
  Smartphone,
  User,
} from "lucide-react";

type PaymentStatus = "Paid" | "Unpaid" | "Pending";

type PaymentDetail = {
  label: string;
  value: string;
  copyable?: boolean;
};

type MobilePaymentMethod = {
  name: string;
  number: string;
  paymentReference: string;
};

export type PaymentSubmission = {
  buyerName: string;
  courseName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  amountPaid: string;
  transactionId: string;
  paymentReference: string;
  additionalMessage: string;
};

type CoursePurchaseInvoiceProps = {
  courseBuyerName?: string;
  courseName?: string;

  receiverName?: string;
  receiverOrganization?: string;
  accountHolderName?: string;

  sentFromName?: string;
  sentFromOrganization?: string;
  sentFromAddress?: string;
  sentFromPhone?: string;
  sentFromEmail?: string;
  sentFromWebsite?: string;

  invoiceNumber?: string;
  invoiceDate?: string;
  paymentDue?: string;
  paymentStatus?: PaymentStatus;

  quantity?: number;
  coursePriceUSD?: number;
  taxPercentage?: number;
  taxAmountUSD?: number;
  totalAmountUSD?: number;
  bangladeshAmountBDT?: number;

  generalPaymentReference?: string;

  bkashNumber?: string;
  bkashPaymentReference?: string;

  nagadNumber?: string;
  nagadPaymentReference?: string;

  rocketNumber?: string;
  rocketPaymentReference?: string;

  achBankName?: string;
  achAccountNumber?: string;
  achRoutingNumber?: string;
  achBankAddress?: string;
  achPaymentReference?: string;

  wireBankName?: string;
  wireIBAN?: string;
  wireSwiftCode?: string;
  wireBankAddress?: string;
  wirePaymentReference?: string;

  supportWhatsApp?: string;
  supportTelegram?: string;
  onPaymentSubmit?: (submission: PaymentSubmission) => Promise<void> | void;
};

const defaultInvoiceData: Required<CoursePurchaseInvoiceProps> = {
  courseBuyerName: "Sarful Hassan",
  courseName: "Industrial Automation Course",

  receiverName: "MechatronicsLAB",
  receiverOrganization: "MechatronicsLAB",
  accountHolderName: "Md Sarful Hassan",

  sentFromName: "Md Sarful Hassan",
  sentFromOrganization: "MechatronicsLAB",
  sentFromAddress:
    "Village Amretopur, Post Panehara, Naogaon, Bangladesh",
  sentFromPhone: "+880 1723-673803",
  sentFromEmail: "support@mechatronicslab.com",
  sentFromWebsite: "www.mechatronicslab.com",

  invoiceNumber: "INV-20260715-003",
  invoiceDate: "July 15, 2026",
  paymentDue: "Immediately",
  paymentStatus: "Unpaid",

  quantity: 1,
  coursePriceUSD: 1.5,
  taxPercentage: 5,
  taxAmountUSD: 0.08,
  totalAmountUSD: 1.58,
  bangladeshAmountBDT: 120,

  generalPaymentReference: "MLAB-COURSE-003",

  bkashNumber: "+880 1723-673803",
  bkashPaymentReference: "MLAB-003-BKASH",

  nagadNumber: "+880 1723-673803",
  nagadPaymentReference: "MLAB-003-NAGAD",

  rocketNumber: "+880 1723-673803",
  rocketPaymentReference: "MLAB-003-ROCKET",

  achBankName: "JP Morgan Chase NA",
  achAccountNumber: "30000001241839",
  achRoutingNumber: "028000024",
  achBankAddress: "270 Park Avenue, New York, NY 10017",
  achPaymentReference: "MLAB-003-ACH",

  wireBankName: "Clear Bank",
  wireIBAN: "GB79CLRB04281270679039",
  wireSwiftCode: "CLRBGB22XXX",
  wireBankAddress:
    "133 Houndsditch, London, EC3A 7BX, United Kingdom",
  wirePaymentReference: "MLAB-003-WIRE",

  supportWhatsApp: "+880 1723-673803",
  supportTelegram: "+880 1723-673803",
  onPaymentSubmit: async () => undefined,
};

function formatUSD(value: number) {
  return `USD ${value.toFixed(2)}`;
}

function formatBDT(value: number) {
  return `BDT ${value.toLocaleString("en-US")}`;
}

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeWebsite(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
}

function getStatusClasses(status: PaymentStatus) {
  if (status === "Paid") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Pending") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch (error) {
      console.error("Unable to copy value:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={copyValue}
      aria-label={`${label}: ${value}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {copied ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

function SectionHeading({
  icon,
  title,
  description,
  compact = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "mb-3 flex items-center gap-3"
          : "mb-4 flex items-center gap-3"
      }
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-700">
        {icon}
      </div>

      <div>
        <h3
          className={
            compact
              ? "text-lg font-bold text-slate-950"
              : "text-xl font-bold text-slate-950"
          }
        >
          {title}
        </h3>

        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function InvoiceMetaRow({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-5">
      <span className="shrink-0 text-slate-500">{label}</span>

      <div className="flex max-w-[170px] flex-col items-end gap-2 text-right">
        <span className="break-all font-semibold text-slate-900">
          {value}
        </span>

        {copyable && <CopyButton value={value} />}
      </div>
    </div>
  );
}

function DetailList({ details }: { details: PaymentDetail[] }) {
  return (
    <div className="divide-y divide-slate-100">
      {details.map((detail) => (
        <div
          key={`${detail.label}-${detail.value}`}
          className="grid gap-2 py-4 sm:grid-cols-[165px_1fr]"
        >
          <p className="text-sm font-medium text-slate-500">
            {detail.label}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="break-all text-sm font-semibold text-slate-900">
              {detail.value}
            </p>

            {detail.copyable && (
              <CopyButton value={detail.value} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MobilePaymentCard({
  method,
}: {
  method: MobilePaymentMethod;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-extrabold text-slate-950">
          {method.name}
        </p>

        <Smartphone className="h-5 w-5 text-blue-600" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Payment Number
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="break-all text-sm font-bold text-slate-950">
            {method.number}
          </p>

          <CopyButton value={method.number} />
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-slate-500" />

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Payment Reference
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="break-all text-sm font-bold text-blue-700">
            {method.paymentReference}
          </p>

          <CopyButton
            value={method.paymentReference}
            label="Copy reference"
          />
        </div>
      </div>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  name: keyof PaymentSubmission;
  value: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

function FormField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

export default function CoursePurchaseInvoice(
  props: CoursePurchaseInvoiceProps,
) {
  const data = {
    ...defaultInvoiceData,
    ...props,
  };

  const paymentReferences = React.useMemo<Record<string, string>>(
    () => ({
      bKash: data.bkashPaymentReference,
      Nagad: data.nagadPaymentReference,
      Rocket: data.rocketPaymentReference,
      ACH: data.achPaymentReference,
      "Wire Transfer": data.wirePaymentReference,
    }),
    [
      data.bkashPaymentReference,
      data.nagadPaymentReference,
      data.rocketPaymentReference,
      data.achPaymentReference,
      data.wirePaymentReference,
    ],
  );

  const [paymentSubmission, setPaymentSubmission] =
    React.useState<PaymentSubmission>({
      buyerName: data.courseBuyerName,
      courseName: data.courseName,
      email: "",
      phone: "",
      paymentMethod: "bKash",
      amountPaid: formatBDT(data.bangladeshAmountBDT),
      transactionId: "",
      paymentReference: data.bkashPaymentReference,
      additionalMessage: "",
    });

  const [formError, setFormError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    setPaymentSubmission((current) => ({
      ...current,
      buyerName: data.courseBuyerName,
      courseName: data.courseName,
      amountPaid:
        current.paymentMethod === "ACH" ||
        current.paymentMethod === "Wire Transfer"
          ? formatUSD(data.totalAmountUSD)
          : formatBDT(data.bangladeshAmountBDT),
      paymentReference:
        paymentReferences[current.paymentMethod] ??
        data.generalPaymentReference,
    }));
  }, [
    data.courseBuyerName,
    data.courseName,
    data.bangladeshAmountBDT,
    data.totalAmountUSD,
    data.generalPaymentReference,
    paymentReferences,
  ]);

  const mobilePaymentMethods: MobilePaymentMethod[] = [
    {
      name: "bKash",
      number: data.bkashNumber,
      paymentReference: data.bkashPaymentReference,
    },
    {
      name: "Nagad",
      number: data.nagadNumber,
      paymentReference: data.nagadPaymentReference,
    },
    {
      name: "Rocket",
      number: data.rocketNumber,
      paymentReference: data.rocketPaymentReference,
    },
  ];

  const achDetails: PaymentDetail[] = [
    {
      label: "Account Holder",
      value: data.accountHolderName,
    },
    {
      label: "Bank Name",
      value: data.achBankName,
    },
    {
      label: "Account Number",
      value: data.achAccountNumber,
      copyable: true,
    },
    {
      label: "Routing Number",
      value: data.achRoutingNumber,
      copyable: true,
    },
    {
      label: "Bank Address",
      value: data.achBankAddress,
    },
    {
      label: "Payment Reference",
      value: data.achPaymentReference,
      copyable: true,
    },
  ];

  const wireDetails: PaymentDetail[] = [
    {
      label: "Account Holder",
      value: data.accountHolderName,
    },
    {
      label: "Bank Name",
      value: data.wireBankName,
    },
    {
      label: "IBAN",
      value: data.wireIBAN,
      copyable: true,
    },
    {
      label: "BIC / SWIFT",
      value: data.wireSwiftCode,
      copyable: true,
    },
    {
      label: "Bank Address",
      value: data.wireBankAddress,
    },
    {
      label: "Payment Reference",
      value: data.wirePaymentReference,
      copyable: true,
    },
  ];

  const confirmationItems = [
    "Course buyer name",
    "Course name",
    "Payment amount",
    "Payment method",
    "Transaction ID",
    "Payment receipt or screenshot",
    "Payment reference",
  ];

  const importantInformation = [
    `This payment is for the digital course: ${data.courseName}.`,
    "No physical product will be delivered.",
    "Use the payment reference shown for the selected payment method.",
    "Keep the payment receipt until the course is activated.",
    "Course access is provided only after successful payment verification.",
    `The fixed payment amount for customers in Bangladesh is ${formatBDT(
      data.bangladeshAmountBDT,
    )}.`,
    "Payments sent to an incorrect number or account may not be recoverable.",
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleSubmissionChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setPaymentSubmission((current) => {
      if (name === "paymentMethod") {
        const isInternational =
          value === "ACH" || value === "Wire Transfer";

        return {
          ...current,
          paymentMethod: value,
          paymentReference:
            paymentReferences[value] ??
            data.generalPaymentReference,
          amountPaid: isInternational
            ? formatUSD(data.totalAmountUSD)
            : formatBDT(data.bangladeshAmountBDT),
        };
      }

      return {
        ...current,
        [name]: value,
      };
    });

    setFormError("");
    setSubmitted(false);
  };

  const handleSendPaymentInformation = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !paymentSubmission.buyerName.trim() ||
      !paymentSubmission.courseName.trim() ||
      !paymentSubmission.phone.trim() ||
      !paymentSubmission.paymentMethod.trim() ||
      !paymentSubmission.amountPaid.trim() ||
      !paymentSubmission.transactionId.trim() ||
      !paymentSubmission.paymentReference.trim()
    ) {
      setFormError(
        "Please complete all required fields before sending.",
      );
      return;
    }

    try {
      await data.onPaymentSubmit(paymentSubmission);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save payment information.");
      setSubmitted(false);
      return;
    }

    const message = [
      "MechatronicsLAB Payment Confirmation",
      "",
      `Invoice Number: ${data.invoiceNumber}`,
      `Invoice Date: ${data.invoiceDate}`,
      `Course Buyer Name: ${paymentSubmission.buyerName}`,
      `Course Name: ${paymentSubmission.courseName}`,
      `Email Address: ${
        paymentSubmission.email || "Not provided"
      }`,
      `Phone Number: ${paymentSubmission.phone}`,
      `Payment Method: ${paymentSubmission.paymentMethod}`,
      `Amount Paid: ${paymentSubmission.amountPaid}`,
      `Transaction ID: ${paymentSubmission.transactionId}`,
      `Payment Reference: ${paymentSubmission.paymentReference}`,
      `Additional Message: ${
        paymentSubmission.additionalMessage || "None"
      }`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${normalizePhoneNumber(
      data.supportWhatsApp,
    )}?text=${encodeURIComponent(message)}`;

    setSubmitted(true);
    setFormError("");

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {data.receiverOrganization} invoice
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Course Purchase Invoice
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              Save as PDF
            </button>
          </div>
        </div>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-none print:shadow-none">
          <header className="border-b border-slate-200 bg-white px-6 py-8 sm:px-10">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <Building2 className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                    {data.receiverOrganization}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    Course Purchase Invoice
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {data.courseName}
                  </p>
                </div>
              </div>

              <div className="min-w-[270px] rounded-2xl border border-slate-200 bg-white p-5">
                <div className="space-y-3 text-sm">
                  <InvoiceMetaRow
                    label="Invoice Number"
                    value={data.invoiceNumber}
                  />

                  <InvoiceMetaRow
                    label="Invoice Date"
                    value={data.invoiceDate}
                  />

                  <InvoiceMetaRow
                    label="Payment Due"
                    value={data.paymentDue}
                  />

                  <InvoiceMetaRow
                    label="Payment Reference"
                    value={data.generalPaymentReference}
                    copyable
                  />

                  <div className="flex items-center justify-between gap-5">
                    <span className="text-slate-500">
                      Payment Status
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusClasses(
                        data.paymentStatus,
                      )}`}
                    >
                      {data.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-10 px-6 py-8 sm:px-10 sm:py-10">
            <section className="grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-500">
                  <User className="h-4 w-4" />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Course Buyer Name
                  </span>
                </div>

                <p className="text-lg font-bold text-slate-950">
                  {data.courseBuyerName}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-500">
                  <FileText className="h-4 w-4" />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Course Name
                  </span>
                </div>

                <p className="text-lg font-bold text-slate-950">
                  {data.courseName}
                </p>

                <p className="mt-1 text-sm font-medium text-blue-700">
                  Provided by {data.receiverOrganization}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-500">
                  <Building2 className="h-4 w-4" />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Sent From
                  </span>
                </div>

                <p className="text-lg font-bold text-slate-950">
                  {data.sentFromName}
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-700">
                  {data.sentFromOrganization}
                </p>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{data.sentFromAddress}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />

                    <a
                      href={`tel:${normalizePhoneNumber(
                        data.sentFromPhone,
                      )}`}
                      className="transition hover:text-blue-700"
                    >
                      {data.sentFromPhone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                    <a
                      href={`mailto:${data.sentFromEmail}`}
                      className="break-all transition hover:text-blue-700"
                    >
                      {data.sentFromEmail}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 shrink-0 text-slate-400" />

                    <a
                      href={normalizeWebsite(
                        data.sentFromWebsite,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all transition hover:text-blue-700"
                    >
                      {data.sentFromWebsite}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading
                icon={<FileText className="h-5 w-5" />}
                title="Invoice Summary"
                description="Course details and payable amounts"
              />

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead className="border-b border-slate-200 bg-white text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4">
                          Description
                        </th>

                        <th className="px-5 py-4">
                          Course Name
                        </th>

                        <th className="px-5 py-4 text-center">
                          Quantity
                        </th>

                        <th className="px-5 py-4 text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                      <tr>
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          Course Purchase
                        </td>

                        <td className="px-5 py-4 font-semibold text-blue-700">
                          {data.courseName}
                        </td>

                        <td className="px-5 py-4 text-center text-slate-600">
                          {data.quantity}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-slate-900">
                          {formatUSD(data.coursePriceUSD)}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-5 py-4 text-slate-600">
                          Tax
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {data.taxPercentage}%
                        </td>

                        <td className="px-5 py-4 text-center text-slate-400">
                          â€”
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-slate-900">
                          {formatUSD(data.taxAmountUSD)}
                        </td>
                      </tr>
                    </tbody>

                    <tfoot>
                      <tr className="border-t border-slate-200 bg-white">
                        <td
                          colSpan={3}
                          className="px-5 py-4 font-bold text-slate-900"
                        >
                          Total International Payment
                        </td>

                        <td className="px-5 py-4 text-right text-lg font-extrabold text-blue-700">
                          {formatUSD(data.totalAmountUSD)}
                        </td>
                      </tr>

                      <tr className="border-t border-slate-200 bg-white">
                        <td
                          colSpan={3}
                          className="px-5 py-4 font-bold text-slate-900"
                        >
                          Fixed Bangladesh Payment Amount
                        </td>

                        <td className="px-5 py-4 text-right text-lg font-extrabold text-emerald-700">
                          {formatBDT(data.bangladeshAmountBDT)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading
                icon={<Smartphone className="h-5 w-5" />}
                title="Bangladesh Payment"
                description="Use the correct payment reference for your selected payment method"
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Fixed Bangladesh Payment Amount
                  </p>

                  <p className="mt-2 text-4xl font-black tracking-tight text-emerald-700">
                    {formatBDT(data.bangladeshAmountBDT)}
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    Course:{" "}
                    <strong className="text-slate-900">
                      {data.courseName}
                    </strong>
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Buyer:{" "}
                    <strong className="text-slate-900">
                      {data.courseBuyerName}
                    </strong>
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {mobilePaymentMethods.map((method) => (
                    <MobilePaymentCard
                      key={method.name}
                      method={method}
                    />
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-6 text-slate-700">
                  Enter the displayed payment reference in the
                  reference, description, or message field when
                  available. After payment, send the transaction ID,
                  payment receipt, course buyer name, and course name
                  for verification.
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <SectionHeading
                  icon={<CreditCard className="h-5 w-5" />}
                  title="ACH Payment"
                  description="United States"
                  compact
                />

                <DetailList details={achDetails} />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <SectionHeading
                  icon={<Globe2 className="h-5 w-5" />}
                  title="International Wire Transfer"
                  description={`${data.wireBankName}, United Kingdom`}
                  compact
                />

                <DetailList details={wireDetails} />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-950">
                  Payment Confirmation
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  After completing the payment, send the following
                  details:
                </p>

                <ul className="mt-5 space-y-3">
                  {confirmationItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-2xl border border-blue-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    General Payment Reference
                  </p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="break-all text-sm font-bold text-blue-700">
                      {data.generalPaymentReference}
                    </p>

                    <CopyButton
                      value={data.generalPaymentReference}
                      label="Copy reference"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-6 w-6 text-violet-700" />

                  <h3 className="text-lg font-bold text-slate-950">
                    Course Activation
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-700">
                  The course <strong>{data.courseName}</strong> for{" "}
                  <strong>{data.courseBuyerName}</strong> will
                  normally be activated within <strong>1 hour</strong>{" "}
                  after successful payment verification.
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  If the course is not activated within 1 hour, send
                  the payment receipt, Transaction ID, course buyer
                  name, course name, and payment reference through
                  WhatsApp or Telegram.
                </p>

                <div className="mt-5 space-y-3">
                  <a
                    href={`https://wa.me/${normalizePhoneNumber(
                      data.supportWhatsApp,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-emerald-600" />

                      <span>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                          WhatsApp
                        </span>

                        <span className="font-bold text-slate-950">
                          {data.supportWhatsApp}
                        </span>
                      </span>
                    </span>

                    <span className="text-sm font-semibold text-blue-700">
                      Contact
                    </span>
                  </a>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-blue-600" />

                      <span>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Telegram
                        </span>

                        <span className="font-bold text-slate-950">
                          {data.supportTelegram}
                        </span>
                      </span>
                    </span>

                    <CopyButton
                      value={data.supportTelegram}
                      label="Copy number"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-bold text-slate-950">
                Important Information
              </h3>

              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {importantInformation.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"
                  >
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="border-t border-slate-200 bg-white px-6 py-10 print:hidden sm:px-10">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <Send className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-2xl font-bold text-slate-950">
                  Send Payment Information
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Complete this form after making your payment. Your
                  payment details will open in WhatsApp, ready to send
                  to the {data.receiverOrganization} support team.
                </p>
              </div>

              <form
                onSubmit={handleSendPaymentInformation}
                className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Course Buyer Name"
                    name="buyerName"
                    value={paymentSubmission.buyerName}
                    onChange={handleSubmissionChange}
                    placeholder="Enter course buyer name"
                    required
                  />

                  <FormField
                    label="Course Name"
                    name="courseName"
                    value={paymentSubmission.courseName}
                    onChange={handleSubmissionChange}
                    placeholder="Enter course name"
                    required
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    value={paymentSubmission.email}
                    onChange={handleSubmissionChange}
                    placeholder="example@email.com"
                    type="email"
                  />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={paymentSubmission.phone}
                    onChange={handleSubmissionChange}
                    placeholder="+880 1XXXXXXXXX"
                    type="tel"
                    required
                  />

                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Payment Method
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={paymentSubmission.paymentMethod}
                      onChange={handleSubmissionChange}
                      required
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="ACH">
                        ACH Bank Transfer
                      </option>
                      <option value="Wire Transfer">
                        International Wire Transfer
                      </option>
                    </select>
                  </div>

                  <FormField
                    label="Amount Paid"
                    name="amountPaid"
                    value={paymentSubmission.amountPaid}
                    onChange={handleSubmissionChange}
                    placeholder="Example: BDT 120"
                    required
                  />

                  <FormField
                    label="Transaction ID"
                    name="transactionId"
                    value={paymentSubmission.transactionId}
                    onChange={handleSubmissionChange}
                    placeholder="Enter transaction ID"
                    required
                  />

                  <FormField
                    label="Payment Reference"
                    name="paymentReference"
                    value={paymentSubmission.paymentReference}
                    onChange={handleSubmissionChange}
                    placeholder="Enter payment reference"
                    required
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="additionalMessage"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Additional Message
                  </label>

                  <textarea
                    id="additionalMessage"
                    name="additionalMessage"
                    value={paymentSubmission.additionalMessage}
                    onChange={handleSubmissionChange}
                    rows={4}
                    placeholder="Write any additional payment or course information..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {formError && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {formError}
                  </div>
                )}

                {submitted && !formError && (
                  <div
                    role="status"
                    className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Your payment information is ready to send through
                    WhatsApp.
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  <Send className="h-4 w-4" />
                  Send Payment Information
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                  Clicking the button opens WhatsApp with your payment
                  information. Review the message and then press Send.
                </p>
              </form>
            </div>
          </section>

          <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center sm:px-10">
            <h3 className="text-xl font-bold text-slate-950">
              Thank you for choosing {data.receiverOrganization}
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              We appreciate the purchase of{" "}
              <strong>{data.courseName}</strong> by{" "}
              <strong>{data.courseBuyerName}</strong> and look forward
              to supporting the learning journey.
            </p>
          </footer>
        </article>
      </div>

      <style jsx global>{`
        @media print {
          html,
          body {
            background: #ffffff !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          article {
            width: 100%;
          }

          a {
            color: inherit !important;
            text-decoration: none !important;
          }

          button {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
