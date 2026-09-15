// src/services/api.ts

import { environment } from "@/config/environment";
import axios from "axios";

export const api = axios.create({
    baseURL: environment.apiBaseUrl,
});