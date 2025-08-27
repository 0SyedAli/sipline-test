import { useState } from "react"
import { AuthBtn } from "../AuthBtn/AuthBtn"
import InputField from "../Form/InputField"
import Modal from "./layout"
import "./modal.css"

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

  console.log(selectedRefund?.transactionId);
  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const referenceNumber = parseInt("769082", 10)

      if (isNaN(referenceNumber)) {
        setError("Invalid transaction ID")
        setIsLoading(false)
        return
      }

      console.log("Sending refund:", {
        referenceNumber,
        amount: Number(amount)
      })

      const response = await fetch(
        "https://api.sandbox.paycreategateway.com/api/v2/transactions/refund",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(`${username}:${password}`),
            "Accept": "*/*",
          },
          mode: "cors", // Explicitly set CORS mode
          body: JSON.stringify({
            reference_number: referenceNumber,
            amount: Number(amount),
          }),
        }
      )

      console.log(response)

      // Check if response is ok first
      if (!response.ok) {
        // Handle 401 specifically
        if (response.status === 401) {
          setError("Authentication failed. Please check your credentials.")
          setIsLoading(false)
          return
        }

        // Handle other HTTP errors
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      onClose()
      setAmount("")
      if (onRefundSuccess) {
        onRefundSuccess(result)
      }
    } catch (err) {
      // More specific error handling
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError("Network error. Please check your connection.")
      } else {
        setError(err.message || "An unexpected error occurred")
      }
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
        <form>
          <div style={{ margin: "35px 0 40px", height: "150px" }}>
            <label className="mb-2">Add Amount</label>
            <InputField
              type="text"
              placeholder="$10"
              id="refundAmount"
              classInput="classInput"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="sort_btn justify-content-end gap-2">
            <button
              onClick={() => {
                onClose()
                setAmount("")
                setError("")
              }}
              type="button"
              className="themebtn4 green btn"
            >
              Cancel
            </button>
            <AuthBtn
              title={isLoading ? "Processing..." : btntitle}
              onClick={handleSubmit}
              location_btn="themebtn4 green btn"
              type="button"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default RefundNow
