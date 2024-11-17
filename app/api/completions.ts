"use server";
import { pipeline } from "@huggingface/transformers";

export async function completions(messages: string[], model_id: string) {
    const pipe = await pipeline("text-generation", model_id, { device: "auto", dtype: "fp16"})
    pipe()
}