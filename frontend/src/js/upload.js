export async function uploadCertificate(file) {
    const token = localStorage.getItem("token")

    const formData = new FormData()
    formData.append("certificate", file)

    const res = await fetch("http://localhost:8000/api/documents/certificate", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })

    if (!res.ok) {
        throw new Error("Upload failed")
    }

    return await res.json()
}