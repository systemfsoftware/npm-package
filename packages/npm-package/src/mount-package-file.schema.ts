import { Workflow } from '@systemfsoftware/effect-cell-types'
import { Schema } from 'effect'

const PackageTreeMountTypeId: unique symbol = Symbol.for('@systemfsoftware/npm-package/PackageTreeMount')
type PackageTreeMountTypeId = typeof PackageTreeMountTypeId

export class PathMounted extends Schema.TaggedClass<PathMounted, { readonly brand: unique symbol }>()('PathMounted', {
  mountedKey: Schema.String,
}) {
  readonly [PackageTreeMountTypeId] = PackageTreeMountTypeId
}

export class UnexpectedAbsoluteFixturePath
  extends Schema.TaggedError<UnexpectedAbsoluteFixturePath, { readonly brand: unique symbol }>()(
    'UnexpectedAbsoluteFixturePath',
    { key: Schema.String },
  )
{
  readonly [PackageTreeMountTypeId] = PackageTreeMountTypeId

  override get message(): string {
    return `Unexpected absolute fixture path: ${this.key}`
  }
}

export class MountPackageFile
  extends Schema.TaggedClass<MountPackageFile, { readonly brand: unique symbol }>()('MountPackageFile', {
    key: Schema.String,
    packageName: Schema.String,
  })
{
  static readonly [Workflow.InstrumentationBrand] = {} as const
}
