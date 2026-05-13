import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Categorías de galería / producto editables desde el panel.
 * Lectura pública (guest) para renderizar la web; escritura solo grupo ADMINS.
 */
const schema = a.schema({
  GalleryCategory: a
    .model({
      /** Slug único para URL y SEO, ej. tapizado-volantes-bucaramanga */
      slug: a.string().required(),
      /** Nombre visible */
      label: a.string().required(),
      /** Texto introductorio en la landing */
      shortDescription: a.string(),
      /** Meta title (si vacío, puedes derivar del label en front) */
      seoTitle: a.string(),
      /** Meta description */
      seoDescription: a.string(),
      /** Orden en listados (menor primero) */
      sortOrder: a.integer(),
      /** Si false, no se muestra en la web pública */
      isPublished: a.boolean(),
      /** Clave S3 bajo `recursos/categoria/` (imagen de portada de la categoría) */
      coverImageKey: a.string(),
      itemLinks: a.hasMany("GalleryItemCategoryLink", "galleryCategoryId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),

  /**
   * Recurso de galería: una imagen + texto + descripción, o antes/después + texto + descripción.
   * Las categorías del sitio se asocian con 0..N enlaces en `GalleryItemCategoryLink`.
   */
  GalleryItem: a
    .model({
      /** "SINGLE" | "BEFORE_AFTER" */
      layoutType: a.string().required(),
      /** Etiqueta opcional (marca de vehículo, etc.) */
      vehicleBrand: a.string(),
      title: a.string().required(),
      body: a.string(),
      imageKeySingle: a.string(),
      imageKeyBefore: a.string(),
      imageKeyAfter: a.string(),
      sortOrder: a.integer(),
      isPublished: a.boolean(),
      categoryLinks: a.hasMany("GalleryItemCategoryLink", "galleryItemId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),

  /** Asigna un recurso de galería a una categoría (muchos a muchos). */
  GalleryItemCategoryLink: a
    .model({
      galleryItemId: a.id().required(),
      galleryItem: a.belongsTo("GalleryItem", "galleryItemId"),
      galleryCategoryId: a.id().required(),
      galleryCategory: a.belongsTo("GalleryCategory", "galleryCategoryId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),

  /**
   * Vehículos destacados en la landing (en venta).
   * Fotos en modelo hijo `VehicleListingImage` (varias + una principal).
   */
  VehicleListing: a
    .model({
      name: a.string().required(),
      /** Marca (selector LATAM en admin; opcional). */
      vehicleBrand: a.string(),
      year: a.integer(),
      kmLabel: a.string(),
      engine: a.string(),
      power: a.string(),
      trans: a.string(),
      priceLabel: a.string(),
      badge: a.string(),
      sortOrder: a.integer(),
      isPublished: a.boolean(),
      images: a.hasMany("VehicleListingImage", "vehicleListingId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),

  VehicleListingImage: a
    .model({
      vehicleListingId: a.id().required(),
      vehicleListing: a.belongsTo("VehicleListing", "vehicleListingId"),
      /** Clave S3 bajo `recursos/vehiculo/` */
      imageKey: a.string().required(),
      imageAlt: a.string(),
      sortOrder: a.integer(),
      /** La tarjeta pública usa la imagen con `isPrimary === true` (o la primera si ninguna). */
      isPrimary: a.boolean(),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
  },
});
