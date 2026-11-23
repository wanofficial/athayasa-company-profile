
import api from "@/lib/api/axios";

export interface WebsiteSetting {
  id: number;

  website_name: string;
  tagline: string | null;
  description: string | null;

  logo: string | null;
  favicon: string | null;

  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;

  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_primary_cta_text: string | null;
  hero_primary_cta_url: string | null;
  hero_secondary_cta_text: string | null;
  hero_secondary_cta_url: string | null;
  hero_image: string | null;

  about_title: string | null;
  about_description: string | null;

  why_title: string | null;

  reason_1_icon: string | null;
  reason_1_title: string | null;
  reason_1_description: string | null;

  reason_2_icon: string | null;
  reason_2_title: string | null;
  reason_2_description: string | null;

  reason_3_icon: string | null;
  reason_3_title: string | null;
  reason_3_description: string | null;

  show_about: boolean;
  show_services: boolean;
  show_projects: boolean;
  show_why_choose_us: boolean;
  show_articles: boolean;
  show_customers: boolean;
  show_contact: boolean;
}

export type WebsiteSettingPayload = Omit<
  WebsiteSetting,
  "id" | "logo" | "favicon" | "hero_image"
> & {
  logo?: File | null;
  favicon?: File | null;
  hero_image?: File | null;
};

/**
 * Compress image using browser Canvas API.
 * Converts supported images into WebP.
 */
async function compressImage(
  file: File,
  options: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
  }
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Preserve ICO and GIF formats instead of converting them.
  if (["image/x-icon", "image/vnd.microsoft.icon", "image/gif"].includes(file.type)) {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to load ${file.name}`));
    });

    const ratio = Math.min(
      1,
      options.maxWidth / image.naturalWidth,
      options.maxHeight / image.naturalHeight
    );

    const width = Math.max(1, Math.round(image.naturalWidth * ratio));
    const height = Math.max(1, Math.round(image.naturalHeight * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Browser does not support image compression.");
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Failed to compress image."));
        },
        "image/webp",
        options.quality
      );
    });

    // Keep original if conversion does not reduce file size.
    if (blob.size >= file.size) {
      return file;
    }

    const compressedName = file.name.replace(/\.[^.]+$/, "") + ".webp";

    return new File([blob], compressedName, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function getWebsiteSettings(): Promise<WebsiteSetting> {
  const response = await api.get("/admin/settings");
  return response.data.data;
}

export async function updateWebsiteSettings(
  payload: WebsiteSettingPayload
): Promise<WebsiteSetting> {
  const formData = new FormData();

  const imageOptions: Record<
    string,
    { maxWidth: number; maxHeight: number; quality: number }
  > = {
    logo: {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.85,
    },
    favicon: {
      maxWidth: 256,
      maxHeight: 256,
      quality: 0.85,
    },
    hero_image: {
      maxWidth: 1920,
      maxHeight: 1200,
      quality: 0.78,
    },
  };

  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (value instanceof File) {
      const options = imageOptions[key];

      const file = options
        ? await compressImage(value, options)
        : value;

      console.info(
        `[Website Settings] ${key}:`,
        `${(value.size / 1024 / 1024).toFixed(2)} MB →`,
        `${(file.size / 1024 / 1024).toFixed(2)} MB`
      );

      formData.append(key, file);
      continue;
    }

    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      continue;
    }

    formData.append(key, String(value));
  }

  const totalSize = Array.from(formData.values()).reduce(
    (total, value) =>
      total + (value instanceof File ? value.size : new Blob([value]).size),
    0
  );

  console.info(
    "[Website Settings] Total payload:",
    `${(totalSize / 1024 / 1024).toFixed(2)} MB`
  );

  const response = await api.post("/admin/settings", formData);

  return response.data.data;
}

export function getWebsiteAssetUrl(path: string | null): string | null {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const backendUrl = apiUrl.replace(/\/api(?:\/v1)?\/?$/, "");

  return `${backendUrl}/storage/${path}`;
}
