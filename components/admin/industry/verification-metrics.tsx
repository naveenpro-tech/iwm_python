"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function VerificationMetrics() {
  // Sample data for verification metrics
  const metrics = {
    averageVerificationTime: "1.8 days",
    verificationApprovalRate: "87%",
    pendingVerifications: 24,
    completedThisMonth: 68,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center p-3 rounded-lg bg-card/50 border border-border"
          >
            <div className="text-sm">Average Verification Time</div>
            <div className="text-lg font-bold">{metrics.averageVerificationTime}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex justify-between items-center p-3 rounded-lg bg-card/50 border border-border"
          >
            <div className="text-sm">Verification Approval Rate</div>
            <div className="text-lg font-bold">{metrics.verificationApprovalRate}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex justify-between items-center p-3 rounded-lg bg-card/50 border border-border"
          >
            <div className="text-sm">Pending Verifications</div>
            <div className="text-lg font-bold">{metrics.pendingVerifications}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex justify-between items-center p-3 rounded-lg bg-card/50 border border-border"
          >
            <div className="text-sm">Completed This Month</div>
            <div className="text-lg font-bold">{metrics.completedThisMonth}</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
