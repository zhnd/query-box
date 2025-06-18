import { Card, CardContent } from '@/components/ui/card'

export function ResourceTopology() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md border border-muted shadow-sm rounded-lg">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="text-9xl">🦉</div>
          <h2 className="text-xl font-semibold">Resource Topology</h2>
          <p className="text-sm text-muted-foreground">
            The GraphQL topology view is currently under development.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
