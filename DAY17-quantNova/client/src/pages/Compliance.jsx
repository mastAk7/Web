export default function Compliance() {
  return (
    <div className="container">
      <h2>Regulatory & Ethical Guardrails</h2>
      <div className="grid">
        <div className="card">
          <h3>Compliance Checklist</h3>
          <ul className="small">
            <li>SEBI Cat III registration</li>
            <li>Custodian, compliance officer</li>
            <li>Periodic reporting</li>
          </ul>
        </div>
        <div className="card">
          <h3>Ethics</h3>
          <ul className="small">
            <li>Data: GDPR/DPDP compliant</li>
            <li>Trading: No spoofing, insider info</li>
            <li>Governance: Trustees, blockchain audits</li>
          </ul>
        </div>
        <div className="card">
          <h3>Compliance Flow</h3>
          <p className="small">Intake → KYC/AML → Suitability → Execution → Reporting → Audit</p>
        </div>
      </div>
    </div>
  );
}


