import { MarkdownRender } from '@/components/markdown-render'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronsUpDown, Hash, Megaphone, Type } from 'lucide-react'
import { FieldList } from '../field-list'
import { useTypeContentService } from './use-service'

export function TypeContent() {
  const service = useTypeContentService()
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="flex-shrink-0 flex items-center justify-center p-2 rounded bg-primary/10">
            <Hash className="h-3 w-3 text-primary" />
          </div>
          <div className="self-stretch w-px bg-border shrink-0" />
          <div className="flex-1 min-w-0 space-y-0">
            <h2
              className="font-medium text-foreground truncate leading-tight"
              title={service.currentFieldCompleteDetails?.info.name}
            >
              {service.currentFieldCompleteDetails?.info.name}
            </h2>

            <div className="text-xs text-muted-foreground font-mono truncate leading-tight">
              <span
                title={service.currentFieldCompleteDetails?.info.displayType}
              >
                {service.currentFieldCompleteDetails?.info.displayType}
              </span>
            </div>
          </div>
        </div>

        {service.currentFieldCompleteDetails?.info.description && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            <MarkdownRender
              content={service.currentFieldCompleteDetails?.info.description}
            />
          </div>
        )}
      </div>

      {service.currentFieldCompleteDetails?.info.deprecationReason && (
        <Alert variant="destructive">
          <Megaphone />
          <AlertTitle>DEPRECATED</AlertTitle>
          <AlertDescription>
            {service.currentFieldCompleteDetails.info.deprecationReason}
          </AlertDescription>
        </Alert>
      )}

      {service.currentFieldCompleteDetails?.info.isLeafType &&
        service.currentFieldCompleteDetails.info.fieldGraphQLType ===
          'scalar' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                  <Type className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        Scalar
                      </Badge>
                      <span className="font-semibold text-sm text-foreground">
                        {service.currentFieldCompleteDetails?.scalarInfo?.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Represents primitive leaf values in a GraphQL type system.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="text-sm">
                    <MarkdownRender
                      content={
                        service.currentFieldCompleteDetails?.scalarInfo
                          ?.description
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {service.renderCardList.map((card) => (
        <Collapsible defaultOpen key={card.id}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <CardTitle className="text-base">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                  <ChevronsUpDown />
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <FieldList
                  subFields={card.fields ?? []}
                  fieldDetails={service.currentFieldCompleteDetails?.info}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
}
