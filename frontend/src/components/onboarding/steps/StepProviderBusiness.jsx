// TODO: step 1 for provider — logo, banner, NIPT, address
import { useState } from 'react'

export function StepProviderBusiness({ onNext }) {
	const [businessName, setBusinessName] = useState('')
	const [address, setAddress] = useState('')

	return (
		<div>
			<h3>Business details</h3>
			<div>
				<label>Business name</label>
				<input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
			</div>
			<div>
				<label>Address</label>
				<input value={address} onChange={(e) => setAddress(e.target.value)} />
			</div>
			<div style={{ marginTop: 12 }}>
				<button onClick={onNext}>Continue</button>
			</div>
		</div>
	)
}

