'use client';

import Script from 'next/script';

declare global {
  interface Window {
    iaSdk?: {
      init: (options: {
        data: { pk: string };
        config?: { style?: { zIndex?: number } };
      }) => void;
    };
  }
}

export default function IASdkWidget() {
  const initializeSdk = () => {
    if (!window.iaSdk) return;

    window.iaSdk.init({
      data: { pk: 'f11045eab32ac04b8553e938688403e7' },
      config: { style: { zIndex: 999999 } },
    });
  };

  return (
    <>
      <div id="ia-sdk-root" />
      <Script
        id="ia-sdk-script"
        src="https://storage.googleapis.com/ia-lt-sdk/prod/ia-sdk.umd.js"
        strategy="afterInteractive"
        onLoad={initializeSdk}
      />
    </>
  );
}
