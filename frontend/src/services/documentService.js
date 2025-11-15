import api from "./api";

export async function uploadDocument({ file, docType }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docType", docType);

  const { data } = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function deleteDocument(id) {
  const { data } = await api.delete(`/documents/${id}`);
  return data;
}

export async function fetchDocuments() {
  const { data } = await api.get("/students/documents");
  return data;
}

