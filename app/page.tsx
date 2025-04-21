import SOSButton from "@/components/sos-button";
import EmergencyForm from "@/components/emergency-form";

export default function EmergencySOSPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8">Emergency SOS</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-xl">
        Press the SOS button below to report an emergency. Your location will be
        automatically shared with emergency services.
      </p>

      <SOSButton />

      <div className="w-full max-w-md mt-12">
        <EmergencyForm />
      </div>
    </div>
  );
}
