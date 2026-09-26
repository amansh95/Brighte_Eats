"use client";

import ErrorState from "../components/ErrorState";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorState
      title="We couldn't load the leads"
      message="The server didn't respond. Please try again in a moment."
      onRetry={retry}
    />
  );
}
