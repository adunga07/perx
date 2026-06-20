// TODO: step 1 for employer — logo, banner, NIPT
import { useState } from 'react'

export function StepEmployerCompany({ onNext }) {
	const [companyName, setCompanyName] = useState('')
	const [nip, setNip] = useState('')

	return (
		<div>
			<h3>Company details</h3>
			<div>
				<label>Company name</label>
				<input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
			</div>
			<div>
				<label>NIPT</label>
				<input value={nip} onChange={(e) => setNip(e.target.value)} />
			</div>
			<div style={{ marginTop: 12 }}>
				<button onClick={onNext}>Continue</button>
			</div>
		</div>
	)
}

