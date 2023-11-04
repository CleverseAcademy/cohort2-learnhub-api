export interface OEmbedResponse {
  url: string;
  thumbnail_height: number;
  version: string;
  width: number;
  thumbnail_width: number;
  provider_name: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  title: string;
  height: number;
  provider_url: string;
  type: string;
  html: string;
}

export interface OEmbedError {
  url: string;
  error: string;
}
