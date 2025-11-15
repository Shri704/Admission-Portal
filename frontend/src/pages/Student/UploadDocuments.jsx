import DocumentUploader from "../../components/common/student/DocumentUploader.jsx";
import useStudent from "../../hooks/useStudent.js";

export default function UploadDocuments() {
  const { documents, addDocument, removeDocument, loading } = useStudent();

  return (
    <div className="min-h-[80vh] space-y-8 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/20 p-6 sm:p-10 md:p-14 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all">
      {/* ===== HEADER ===== */}
      <header className="border-b border-indigo-100/50 pb-4">
        <h1 className="text-3xl font-extrabold text-dark drop-shadow-sm">
          Upload Documents
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 leading-relaxed">
          Submit high-quality scanned copies of your eligibility documents for verification.
          Accepted formats: <span className="font-semibold text-primary">PDF</span>,{" "}
          <span className="font-semibold text-primary">JPG</span>, or{" "}
          <span className="font-semibold text-primary">PNG</span> (Max 5MB per file).
        </p>
      </header>

      {/* ===== UPLOAD CARD ===== */}
      <section className="rounded-3xl bg-white/90 p-8 shadow-[0_28px_70px_rgba(37,99,235,0.16)] backdrop-blur-md hover:shadow-[0_32px_80px_rgba(37,99,235,0.2)] transition">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-dark">Your Documents</h2>
          <p className="text-sm text-gray-600">
            Upload or manage the documents required for your admission process.
          </p>
        </div>

        <DocumentUploader
          documents={documents}
          onUpload={addDocument}
          onDelete={removeDocument}
          loading={loading}
        />
      </section>

      {/* ===== FOOTER NOTE ===== */}
      <footer className="mt-4 rounded-xl bg-white/80 p-4 text-center text-sm text-gray-600 shadow-inner">
        📎 Ensure all uploaded files are legible and contain valid information.
        Incorrect uploads may delay your verification process.
      </footer>
    </div>
  );
}
