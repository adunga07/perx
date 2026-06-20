// TODO: step 1 for employee — photo, tags, phone
import { useState } from 'react'

export function StepEmployeeProfile({ onNext }) {
	const [phone, setPhone] = useState('')
	const [tags, setTags] = useState('')

	return (
		<div>
			<h3>Tell us about you</h3>
			<div>
				<label>Phone</label>
				<input value={phone} onChange={(e) => setPhone(e.target.value)} />
			</div>
			<div>
				<label>Interests (comma)</label>
				<input value={tags} onChange={(e) => setTags(e.target.value)} />
			</div>
			<div style={{ marginTop: 12 }}>
				<button onClick={onNext}>Continue</button>
			</div>
		</div>
	)
}

