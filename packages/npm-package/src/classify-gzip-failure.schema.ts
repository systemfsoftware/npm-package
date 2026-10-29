import { Workflow } from '@systemfsoftware/effect-cell-types'
import { Schema } from 'effect'

const GzipFailureDecisionTypeId: unique symbol = Symbol.for(
  '@systemfsoftware/npm-package/GzipFailureDecision',
)
type GzipFailureDecisionTypeId = typeof GzipFailureDecisionTypeId

export class NotGzipHeader
  extends Schema.TaggedClass<NotGzipHeader, { readonly brand: unique symbol }>()('NotGzipHeader', {})
{
  readonly [GzipFailureDecisionTypeId] = GzipFailureDecisionTypeId
}

export class DamagedGzipStream
  extends Schema.TaggedClass<DamagedGzipStream, { readonly brand: unique symbol }>()('DamagedGzipStream', {})
{
  readonly [GzipFailureDecisionTypeId] = GzipFailureDecisionTypeId
}

export const GzipFailureDecision = Schema.Union([NotGzipHeader, DamagedGzipStream])
export type GzipFailureDecision = typeof GzipFailureDecision.Type

export class ClassifyGzipFailure
  extends Schema.TaggedClass<ClassifyGzipFailure, { readonly brand: unique symbol }>()('ClassifyGzipFailure', {
    code: Schema.NullOr(Schema.Finite),
  })
{
  static readonly [Workflow.InstrumentationBrand] = {} as const
}
