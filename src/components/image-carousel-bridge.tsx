import { ImageCarousel } from "@/components/image-carousel";

type ImageCarouselBridgeProps = {
  images?: unknown;
};

export function ImageCarouselBridge({ images }: ImageCarouselBridgeProps) {
  let imagesPayload = "[]";
  try {
    imagesPayload = JSON.stringify(images ?? []);
  } catch {
    imagesPayload = "[]";
  }

  return <ImageCarousel images={imagesPayload} />;
}
