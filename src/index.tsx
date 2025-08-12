import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PaymentGatewayManagement } from "./screens/PaymentGatewayManagement/PaymentGatewayManagement";
import { ConfigurePaymentGateways } from "./pages/ConfigurePaymentGateways";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaymentGatewayManagement />} />
        <Route path="/configure" element={<ConfigurePaymentGateways />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
