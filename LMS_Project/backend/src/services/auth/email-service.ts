type EmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(input: EmailInput) {
  console.log(
    JSON.stringify(
      {
        channel: "email",
        ...input,
      },
      null,
      2,
    ),
  );

  return {
    delivered: true,
    provider: "console-dev",
  };
}
