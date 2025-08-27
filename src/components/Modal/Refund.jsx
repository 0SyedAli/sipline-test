import { useState } from "react"
import { AuthBtn } from "../AuthBtn/AuthBtn"
import InputField from "../Form/InputField"
import Modal from "./layout"
import "./modal.css"
import { toast } from "react-toastify";
function RefundNow({
  isOpen,
  onClose,
  btntitle,
  selectedRefund,
  onRefundSuccess,
  username,
  password
}) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const referenceNumber = parseInt(selectedRefund?.transactionId || "769248", 10)

      if (isNaN(referenceNumber)) {
        setError("Invalid transaction ID")
        setIsLoading(false)
        return
      }

      // console.log("Sending refund via proxy:", {
      //   referenceNumber,
      //   amount: Number(amount)
      // })

      // Call our Next.js API route
      const response = await fetch("/api/process-refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference_number: referenceNumber,
          amount: Number(amount),
          username,
          password
        }),
      })

      // const result = await response.json()

      // console.log("Proxy response:", result)

      // if (response.ok) {
      //   // Check if the payment gateway API call was successful
      //   if (result.error) {
      //     // Payment gateway returned an error
      //     setError(result.error + (result.details ? `: ${result.details}` : ''))
      //   } else if (result.status === "Approved" || result.status === "approved") {
      //     // SUCCESS: Payment was approved by gateway
      //     onClose()
      //     setAmount("")
      //     if (onRefundSuccess) {
      //       onRefundSuccess(result) // This will update status to "Refund"
      //     }
      //   } else {
      //     // Payment gateway returned non-approved status
      //     setError(`Refund failed. Status: ${result.status || "Unknown"}`)
      //   }
      // } else {
      //   // Proxy or network error
      //   if (result.error === "Payment gateway returned an error page") {
      //     setError("Payment service is temporarily unavailable. Please try again later.")
      //   } else if (result.rawResponse) {
      //     setError(`Unexpected response from server: ${result.rawResponse.substring(0, 100)}...`)
      //   } else {
      //     setError(result.message || result.error || `Refund failed (Status: ${response.status})`)
      //   }
      const result = await response.json()

      // console.log("Proxy response:", result)

      if (response.ok) {
        if (result.status?.toLowerCase() === "approved") {
          toast.success(result?.msg || "Refund approved successfully ✅")
          onClose()
          setAmount("")
          if (onRefundSuccess) {
            onRefundSuccess(result) // update status to "Refund"
          }
        } else if (result.status?.toLowerCase() === "error") {
          toast.error(result?.error_message || result?.msg || "Refund failed ❌")
          onClose()
        } else {
          toast.error(`Refund failed. Status: ${result.status || "Unknown"}`)
          onClose()
        }
      } else {
        toast.error(result?.message || result?.error || `Refund failed (Status: ${response.status})`)
        onClose()
      }
    } catch (err) {
      console.error("Request error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="AddCategory_modal_body">
        <h3>Refund Request</h3>
        <p>
          <strong>Reference Number:</strong>{" "}
          {selectedRefund?.transactionId || "N/A"}
        </p>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div style={{ margin: "35px 0 40px", height: "150px" }}>
            <label className="mb-2">Add Amount</label>
            <InputField
              type="number"
              step="0.01"
              min="0.01"
              placeholder="$10.00"
              id="refundAmount"
              classInput="classInput"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#ffeeee", borderRadius: "4px" }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className="sort_btn justify-content-end gap-2">
            <button
              onClick={() => {
                onClose()
                setAmount("")
                setError("")
              }}
              type="button"
              className="themebtn4 green btn"
              disabled={isLoading}
            >
              Cancel
            </button>
            <AuthBtn
              title={isLoading ? "Processing..." : btntitle}
              onClick={handleSubmit}
              location_btn="themebtn4 green btn"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default RefundNow