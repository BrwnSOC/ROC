import { DashboardLayout } from "@/components/dashboard-layout"
import { CaseTable } from "@/components/case-table"

export default function CasesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Case Management</h2>
          <p className="text-muted-foreground">Track and manage cybersecurity investigation cases</p>
        </div>
        <CaseTable />
      </div>
    </DashboardLayout>
  )
}
