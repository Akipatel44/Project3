// OTPInput Component - Usage Examples
// This file demonstrates how to use the reusable OTPInput component in other pages

/*
EXAMPLE 1: Basic Usage in a Page
----------------------------------------
import { useState } from 'react'
import OTPInput from '@/components/ui/OTPInput'

export default function MyPage() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    // Verify OTP
  }

  return (
    <div>
      <OTPInput 
        value={otp} 
        onChange={setOtp}
        error={!!error}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button onClick={handleVerify}>Verify</button>
    </div>
  )
}
*/

/*
EXAMPLE 2: With Phone Verification
----------------------------------------
import { useState } from 'react'
import OTPInput from '@/components/ui/OTPInput'

export default function PhoneVerification() {
  const [otp, setOtp] = useState('')

  return (
    <div className="p-8">
      <h1>Verify Your Phone</h1>
      <p>Enter the 6-digit code sent to your phone</p>
      <OTPInput value={otp} onChange={setOtp} />
    </div>
  )
}
*/

/*
OTPInput COMPONENT FEATURES:
========================================

Props:
------
value (string)          - Current OTP value
onChange (function)     - Callback when OTP changes
error (boolean)         - Show error state

Features:
---------
✅ 6 separate input boxes
✅ Accepts only digits
✅ Auto-focus to next input on digit entry
✅ Backspace goes to previous input
✅ Arrow keys navigate between boxes
✅ Paste support (pastes full OTP if 6 digits)
✅ Click to select all digits in a box
✅ Smooth Framer Motion animations
✅ Error state styling (red border/background)
✅ Hover effects
✅ Fully responsive

Styling:
--------
- Error state: border-red-500, bg-red-50, ring-red-300
- Normal state: border-gray-300, hover:border-green-400, focus:border-green-600
- Animations: Stagger, scale on hover/tap
- Smooth transitions: 200ms

Event Handling:
---------------
- onInput: Handle digit entry and auto-focus
- onKeyDown: Handle backspace and arrow keys
- onPaste: Handle clipboard paste (full OTP)
- onFocus: Select all text when focused

Keyboard Shortcuts:
-------------------
- Type 0-9: Enter digit and focus next input
- Backspace: Delete and focus previous input
- Left Arrow: Focus previous input
- Right Arrow: Focus next input
- Ctrl+V / Cmd+V: Paste OTP
*/
