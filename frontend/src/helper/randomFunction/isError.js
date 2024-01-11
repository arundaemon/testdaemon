import toast from "react-hot-toast"

export const isError = (error) => {
  let data = error?.response?.data
	let message = Array.isArray(data.errors) ? data.errors.map((data) => toast.error(data.detail) ) : ""
  return message
}