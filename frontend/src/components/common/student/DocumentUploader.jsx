import { useMemo, useState } from "react";
import useUpload from "../../../hooks/useUpload.js";
import { DOCUMENT_TYPES, REQUIRED_DOCUMENT_TYPES } from "../../../utils/constants.js";

export default function DocumentUploader({
  documents = [],
  onUpload,
  onDelete,
  loading,
}) {
  const [selectedType, setSelectedType] = useState(DOCUMENT_TYPES[0]?.value ?? "");
  const [uploading, setUploading] = useState(false);
  const upload = useUpload({ accept: ".jpg,.jpeg,.png,.pdf" });

  const documentsByType = useMemo(() => {
    const map = new Map();
    documents.forEach((doc) => {
      map.set(doc.docType, doc);
    });
    return map;
  }, [documents]);

  const missingRequiredDocs = useMemo(
    () => REQUIRED_DOCUMENT_TYPES.filter((type) => !documentsByType.has(type)),
    [documentsByType]
  );

  const requiredCompletion = REQUIRED_DOCUMENT_TYPES.length
    ? ((REQUIRED_DOCUMENT_TYPES.length - missingRequiredDocs.length) /
        REQUIRED_DOCUMENT_TYPES.length) *
      100
    : 100;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      await onUpload?.({ file, docType: selectedType });
    } finally {
      setUploading(false);
      upload.reset();
    }
  };

  return (
    <section className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-[0_8px_25px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(37,99,235,0.08)]">
      <div className="flex flex-col gap-6">
        {/* ===== Header ===== */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Documents
            </h3>
            <div className="space-y-1 text-sm text-gray-500">
              <p>
                Upload your eligibility and admission documents in PDF or image format (max 5MB).
              </p>
              <p className="text-xs font-medium text-indigo-600">
                {missingRequiredDocs.length === 0
                  ? "All mandatory documents are uploaded."
                  : `Missing ${missingRequiredDocs.length} of ${REQUIRED_DOCUMENT_TYPES.length} mandatory documents.`}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            >
              {DOCUMENT_TYPES.map((doc) => (
                <option key={doc.value} value={doc.value}>
                  {doc.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={upload.trigger}
              disabled={uploading || loading}
              className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-500 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            {/* Hidden input */}
            <input {...upload.getInputProps(handleFileChange)} />
          </div>
        </header>

        {/* ===== Progress ===== */}
        <div className="rounded-2xl border border-indigo-100/70 bg-indigo-50/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-indigo-900">
              Required documents uploaded: {REQUIRED_DOCUMENT_TYPES.length - missingRequiredDocs.length}/
              {REQUIRED_DOCUMENT_TYPES.length}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {Math.round(requiredCompletion)}% complete
            </span>
          </div>
          {missingRequiredDocs.length > 0 && (
            <p className="mt-2 text-xs text-indigo-700">
              Pending:{" "}
              {missingRequiredDocs
                .map(
                  (type) =>
                    DOCUMENT_TYPES.find((doc) => doc.value === type)?.label || type
                )
                .join(", ")}
            </p>
          )}
        </div>

        {/* ===== Document List ===== */}
        {documents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
            No documents uploaded yet.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {documents.map((doc) => (
              <li
                key={doc._id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {DOCUMENT_TYPES.find((item) => item.value === doc.docType)?.label ??
                      doc.docType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                  {REQUIRED_DOCUMENT_TYPES.includes(doc.docType) ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Required
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      Optional
                    </span>
                  )}
                  {doc.verified && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-indigo-600 hover:underline hover:text-indigo-500"
                  >
                    View
                  </a>
                  <button
                    onClick={() => onDelete?.(doc._id)}
                    className="text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
