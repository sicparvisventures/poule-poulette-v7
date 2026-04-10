import { Suspense } from "react";
import { AdminLoginScreen } from "@/components/admin/AdminLoginScreen";

export default function BackstagePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-pp-olive px-4" />
      }
    >
      <AdminLoginScreen />
    </Suspense>
  );
}
