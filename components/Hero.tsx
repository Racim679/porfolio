'use client';

import Image from 'next/image';
import AuditButton from './AuditButton';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface HeroProps {
  profileImage?: string;
  description?: string;
}

// Trajectoire rééchantillonnée, densité uniforme — 500 points (plus fluide)
const planePath = [
  { x: 0.09, y: 48.24 },
  { x: 0.46, y: 48.28 },
  { x: 0.83, y: 48.33 },
  { x: 1.2, y: 48.36 },
  { x: 1.57, y: 48.4 },
  { x: 1.93, y: 48.44 },
  { x: 2.3, y: 48.49 },
  { x: 2.67, y: 48.53 },
  { x: 3.04, y: 48.57 },
  { x: 3.41, y: 48.61 },
  { x: 3.78, y: 48.66 },
  { x: 4.15, y: 48.7 },
  { x: 4.51, y: 48.74 },
  { x: 4.88, y: 48.78 },
  { x: 5.25, y: 48.83 },
  { x: 5.62, y: 48.87 },
  { x: 5.99, y: 48.91 },
  { x: 6.36, y: 48.95 },
  { x: 6.73, y: 49.0 },
  { x: 7.09, y: 49.05 },
  { x: 7.46, y: 49.1 },
  { x: 7.83, y: 49.14 },
  { x: 8.2, y: 49.19 },
  { x: 8.57, y: 49.23 },
  { x: 8.94, y: 49.28 },
  { x: 9.3, y: 49.32 },
  { x: 9.67, y: 49.37 },
  { x: 10.04, y: 49.42 },
  { x: 10.41, y: 49.47 },
  { x: 10.78, y: 49.52 },
  { x: 11.14, y: 49.57 },
  { x: 11.51, y: 49.62 },
  { x: 11.88, y: 49.68 },
  { x: 12.24, y: 49.73 },
  { x: 12.61, y: 49.79 },
  { x: 12.98, y: 49.85 },
  { x: 13.34, y: 49.9 },
  { x: 13.71, y: 49.97 },
  { x: 14.07, y: 50.04 },
  { x: 14.44, y: 50.1 },
  { x: 14.8, y: 50.17 },
  { x: 15.17, y: 50.24 },
  { x: 15.53, y: 50.31 },
  { x: 15.9, y: 50.39 },
  { x: 16.26, y: 50.48 },
  { x: 16.62, y: 50.56 },
  { x: 16.98, y: 50.65 },
  { x: 17.34, y: 50.74 },
  { x: 17.69, y: 50.85 },
  { x: 18.05, y: 50.96 },
  { x: 18.4, y: 51.08 },
  { x: 18.75, y: 51.19 },
  { x: 19.1, y: 51.33 },
  { x: 19.44, y: 51.46 },
  { x: 19.78, y: 51.61 },
  { x: 20.12, y: 51.76 },
  { x: 20.46, y: 51.92 },
  { x: 20.8, y: 52.07 },
  { x: 21.12, y: 52.25 },
  { x: 21.45, y: 52.42 },
  { x: 21.78, y: 52.6 },
  { x: 22.1, y: 52.77 },
  { x: 22.42, y: 52.96 },
  { x: 22.74, y: 53.15 },
  { x: 23.06, y: 53.35 },
  { x: 23.37, y: 53.54 },
  { x: 23.69, y: 53.74 },
  { x: 24.0, y: 53.94 },
  { x: 24.31, y: 54.15 },
  { x: 24.62, y: 54.35 },
  { x: 24.93, y: 54.56 },
  { x: 25.24, y: 54.76 },
  { x: 25.54, y: 54.97 },
  { x: 25.84, y: 55.19 },
  { x: 26.14, y: 55.41 },
  { x: 26.44, y: 55.62 },
  { x: 26.74, y: 55.84 },
  { x: 27.04, y: 56.07 },
  { x: 27.34, y: 56.29 },
  { x: 27.63, y: 56.51 },
  { x: 27.93, y: 56.74 },
  { x: 28.22, y: 56.96 },
  { x: 28.52, y: 57.19 },
  { x: 28.81, y: 57.42 },
  { x: 29.09, y: 57.66 },
  { x: 29.38, y: 57.9 },
  { x: 29.66, y: 58.13 },
  { x: 29.95, y: 58.37 },
  { x: 30.23, y: 58.61 },
  { x: 30.51, y: 58.86 },
  { x: 30.78, y: 59.11 },
  { x: 31.05, y: 59.36 },
  { x: 31.33, y: 59.61 },
  { x: 31.6, y: 59.86 },
  { x: 31.86, y: 60.13 },
  { x: 32.12, y: 60.4 },
  { x: 32.37, y: 60.66 },
  { x: 32.63, y: 60.93 },
  { x: 32.88, y: 61.21 },
  { x: 33.13, y: 61.48 },
  { x: 33.37, y: 61.77 },
  { x: 33.6, y: 62.05 },
  { x: 33.84, y: 62.34 },
  { x: 34.07, y: 62.63 },
  { x: 34.29, y: 62.92 },
  { x: 34.51, y: 63.22 },
  { x: 34.73, y: 63.53 },
  { x: 34.94, y: 63.83 },
  { x: 35.15, y: 64.14 },
  { x: 35.35, y: 64.45 },
  { x: 35.56, y: 64.76 },
  { x: 35.74, y: 65.08 },
  { x: 35.92, y: 65.4 },
  { x: 36.1, y: 65.73 },
  { x: 36.28, y: 66.06 },
  { x: 36.44, y: 66.39 },
  { x: 36.61, y: 66.72 },
  { x: 36.76, y: 67.06 },
  { x: 36.91, y: 67.4 },
  { x: 37.05, y: 67.74 },
  { x: 37.18, y: 68.09 },
  { x: 37.3, y: 68.44 },
  { x: 37.42, y: 68.79 },
  { x: 37.53, y: 69.15 },
  { x: 37.63, y: 69.5 },
  { x: 37.72, y: 69.86 },
  { x: 37.79, y: 70.23 },
  { x: 37.87, y: 70.59 },
  { x: 37.93, y: 70.96 },
  { x: 38.0, y: 71.32 },
  { x: 38.05, y: 71.69 },
  { x: 38.11, y: 72.06 },
  { x: 38.14, y: 72.42 },
  { x: 38.18, y: 72.79 },
  { x: 38.21, y: 73.16 },
  { x: 38.24, y: 73.53 },
  { x: 38.26, y: 73.9 },
  { x: 38.28, y: 74.27 },
  { x: 38.29, y: 74.65 },
  { x: 38.29, y: 75.02 },
  { x: 38.29, y: 75.39 },
  { x: 38.28, y: 75.76 },
  { x: 38.27, y: 76.13 },
  { x: 38.25, y: 76.5 },
  { x: 38.23, y: 76.87 },
  { x: 38.21, y: 77.24 },
  { x: 38.18, y: 77.61 },
  { x: 38.13, y: 77.98 },
  { x: 38.08, y: 78.35 },
  { x: 38.03, y: 78.71 },
  { x: 37.98, y: 79.08 },
  { x: 37.89, y: 79.44 },
  { x: 37.8, y: 79.8 },
  { x: 37.68, y: 80.15 },
  { x: 37.54, y: 80.49 },
  { x: 37.39, y: 80.84 },
  { x: 37.24, y: 81.17 },
  { x: 37.06, y: 81.5 },
  { x: 36.87, y: 81.82 },
  { x: 36.67, y: 82.13 },
  { x: 36.47, y: 82.44 },
  { x: 36.25, y: 82.74 },
  { x: 36.01, y: 83.02 },
  { x: 35.74, y: 83.27 },
  { x: 35.45, y: 83.51 },
  { x: 35.15, y: 83.73 },
  { x: 34.84, y: 83.94 },
  { x: 34.53, y: 84.13 },
  { x: 34.19, y: 84.28 },
  { x: 33.84, y: 84.41 },
  { x: 33.49, y: 84.54 },
  { x: 33.13, y: 84.63 },
  { x: 32.77, y: 84.72 },
  { x: 32.41, y: 84.77 },
  { x: 32.04, y: 84.83 },
  { x: 31.67, y: 84.86 },
  { x: 31.3, y: 84.89 },
  { x: 30.93, y: 84.9 },
  { x: 30.56, y: 84.91 },
  { x: 30.19, y: 84.87 },
  { x: 29.82, y: 84.83 },
  { x: 29.45, y: 84.77 },
  { x: 29.09, y: 84.7 },
  { x: 28.73, y: 84.6 },
  { x: 28.38, y: 84.48 },
  { x: 28.04, y: 84.33 },
  { x: 27.71, y: 84.16 },
  { x: 27.4, y: 83.97 },
  { x: 27.09, y: 83.76 },
  { x: 26.79, y: 83.54 },
  { x: 26.52, y: 83.28 },
  { x: 26.28, y: 83.0 },
  { x: 26.07, y: 82.7 },
  { x: 25.86, y: 82.39 },
  { x: 25.67, y: 82.07 },
  { x: 25.51, y: 81.74 },
  { x: 25.37, y: 81.4 },
  { x: 25.24, y: 81.05 },
  { x: 25.13, y: 80.69 },
  { x: 25.04, y: 80.33 },
  { x: 24.97, y: 79.97 },
  { x: 24.91, y: 79.6 },
  { x: 24.87, y: 79.23 },
  { x: 24.84, y: 78.86 },
  { x: 24.82, y: 78.49 },
  { x: 24.83, y: 78.12 },
  { x: 24.85, y: 77.75 },
  { x: 24.88, y: 77.38 },
  { x: 24.92, y: 77.01 },
  { x: 24.96, y: 76.64 },
  { x: 25.03, y: 76.28 },
  { x: 25.1, y: 75.91 },
  { x: 25.19, y: 75.56 },
  { x: 25.28, y: 75.2 },
  { x: 25.41, y: 74.85 },
  { x: 25.55, y: 74.51 },
  { x: 25.73, y: 74.18 },
  { x: 25.91, y: 73.86 },
  { x: 26.13, y: 73.55 },
  { x: 26.35, y: 73.26 },
  { x: 26.59, y: 72.98 },
  { x: 26.85, y: 72.71 },
  { x: 27.11, y: 72.45 },
  { x: 27.38, y: 72.19 },
  { x: 27.65, y: 71.94 },
  { x: 27.93, y: 71.69 },
  { x: 28.21, y: 71.45 },
  { x: 28.49, y: 71.2 },
  { x: 28.77, y: 70.96 },
  { x: 29.06, y: 70.73 },
  { x: 29.35, y: 70.5 },
  { x: 29.63, y: 70.26 },
  { x: 29.92, y: 70.03 },
  { x: 30.21, y: 69.79 },
  { x: 30.5, y: 69.56 },
  { x: 30.79, y: 69.33 },
  { x: 31.09, y: 69.11 },
  { x: 31.38, y: 68.88 },
  { x: 31.67, y: 68.65 },
  { x: 31.97, y: 68.42 },
  { x: 32.26, y: 68.2 },
  { x: 32.55, y: 67.97 },
  { x: 32.84, y: 67.74 },
  { x: 33.13, y: 67.51 },
  { x: 33.42, y: 67.28 },
  { x: 33.71, y: 67.04 },
  { x: 34.0, y: 66.81 },
  { x: 34.29, y: 66.58 },
  { x: 34.58, y: 66.35 },
  { x: 34.88, y: 66.12 },
  { x: 35.17, y: 65.9 },
  { x: 35.47, y: 65.67 },
  { x: 35.76, y: 65.44 },
  { x: 36.05, y: 65.22 },
  { x: 36.35, y: 65.0 },
  { x: 36.65, y: 64.78 },
  { x: 36.96, y: 64.57 },
  { x: 37.26, y: 64.36 },
  { x: 37.57, y: 64.15 },
  { x: 37.88, y: 63.95 },
  { x: 38.2, y: 63.75 },
  { x: 38.52, y: 63.57 },
  { x: 38.84, y: 63.39 },
  { x: 39.17, y: 63.22 },
  { x: 39.5, y: 63.04 },
  { x: 39.84, y: 62.88 },
  { x: 40.17, y: 62.72 },
  { x: 40.51, y: 62.58 },
  { x: 40.85, y: 62.43 },
  { x: 41.2, y: 62.3 },
  { x: 41.54, y: 62.16 },
  { x: 41.89, y: 62.03 },
  { x: 42.24, y: 61.91 },
  { x: 42.59, y: 61.79 },
  { x: 42.95, y: 61.68 },
  { x: 43.31, y: 61.58 },
  { x: 43.66, y: 61.48 },
  { x: 44.02, y: 61.38 },
  { x: 44.38, y: 61.29 },
  { x: 44.74, y: 61.21 },
  { x: 45.1, y: 61.13 },
  { x: 45.47, y: 61.05 },
  { x: 45.83, y: 60.99 },
  { x: 46.2, y: 60.93 },
  { x: 46.57, y: 60.86 },
  { x: 46.93, y: 60.8 },
  { x: 47.3, y: 60.75 },
  { x: 47.66, y: 60.69 },
  { x: 48.03, y: 60.63 },
  { x: 48.4, y: 60.56 },
  { x: 48.76, y: 60.5 },
  { x: 49.13, y: 60.44 },
  { x: 49.49, y: 60.37 },
  { x: 49.86, y: 60.31 },
  { x: 50.22, y: 60.25 },
  { x: 50.59, y: 60.19 },
  { x: 50.96, y: 60.13 },
  { x: 51.32, y: 60.08 },
  { x: 51.69, y: 60.03 },
  { x: 52.06, y: 59.99 },
  { x: 52.43, y: 59.95 },
  { x: 52.8, y: 59.91 },
  { x: 53.17, y: 59.88 },
  { x: 53.54, y: 59.87 },
  { x: 53.91, y: 59.85 },
  { x: 54.28, y: 59.85 },
  { x: 54.65, y: 59.85 },
  { x: 55.02, y: 59.87 },
  { x: 55.39, y: 59.89 },
  { x: 55.76, y: 59.93 },
  { x: 56.13, y: 59.96 },
  { x: 56.5, y: 60.01 },
  { x: 56.87, y: 60.06 },
  { x: 57.24, y: 60.12 },
  { x: 57.6, y: 60.17 },
  { x: 57.97, y: 60.23 },
  { x: 58.33, y: 60.3 },
  { x: 58.7, y: 60.37 },
  { x: 59.06, y: 60.45 },
  { x: 59.42, y: 60.53 },
  { x: 59.78, y: 60.61 },
  { x: 60.15, y: 60.69 },
  { x: 60.51, y: 60.77 },
  { x: 60.87, y: 60.85 },
  { x: 61.23, y: 60.94 },
  { x: 61.59, y: 61.03 },
  { x: 61.95, y: 61.12 },
  { x: 62.31, y: 61.22 },
  { x: 62.67, y: 61.32 },
  { x: 63.02, y: 61.42 },
  { x: 63.38, y: 61.53 },
  { x: 63.73, y: 61.64 },
  { x: 64.08, y: 61.76 },
  { x: 64.44, y: 61.87 },
  { x: 64.79, y: 61.98 },
  { x: 65.15, y: 62.08 },
  { x: 65.51, y: 62.18 },
  { x: 65.87, y: 62.26 },
  { x: 66.23, y: 62.35 },
  { x: 66.6, y: 62.41 },
  { x: 66.96, y: 62.47 },
  { x: 67.33, y: 62.5 },
  { x: 67.7, y: 62.53 },
  { x: 68.07, y: 62.55 },
  { x: 68.44, y: 62.57 },
  { x: 68.81, y: 62.56 },
  { x: 69.19, y: 62.55 },
  { x: 69.56, y: 62.53 },
  { x: 69.93, y: 62.5 },
  { x: 70.3, y: 62.47 },
  { x: 70.66, y: 62.43 },
  { x: 71.03, y: 62.38 },
  { x: 71.4, y: 62.31 },
  { x: 71.76, y: 62.24 },
  { x: 72.12, y: 62.15 },
  { x: 72.48, y: 62.06 },
  { x: 72.83, y: 61.93 },
  { x: 73.18, y: 61.8 },
  { x: 73.48, y: 61.59 },
  { x: 73.79, y: 61.38 },
  { x: 74.08, y: 61.15 },
  { x: 74.36, y: 60.91 },
  { x: 74.63, y: 60.66 },
  { x: 74.89, y: 60.39 },
  { x: 75.13, y: 60.11 },
  { x: 75.37, y: 59.82 },
  { x: 75.61, y: 59.54 },
  { x: 75.86, y: 59.27 },
  { x: 76.11, y: 58.99 },
  { x: 76.36, y: 58.72 },
  { x: 76.62, y: 58.46 },
  { x: 76.88, y: 58.19 },
  { x: 77.14, y: 57.92 },
  { x: 77.4, y: 57.66 },
  { x: 77.66, y: 57.39 },
  { x: 77.92, y: 57.13 },
  { x: 78.18, y: 56.86 },
  { x: 78.43, y: 56.6 },
  { x: 78.69, y: 56.33 },
  { x: 78.95, y: 56.06 },
  { x: 79.2, y: 55.79 },
  { x: 79.45, y: 55.52 },
  { x: 79.7, y: 55.24 },
  { x: 79.95, y: 54.97 },
  { x: 80.2, y: 54.69 },
  { x: 80.45, y: 54.42 },
  { x: 80.7, y: 54.14 },
  { x: 80.94, y: 53.86 },
  { x: 81.18, y: 53.58 },
  { x: 81.43, y: 53.3 },
  { x: 81.67, y: 53.02 },
  { x: 81.92, y: 52.74 },
  { x: 82.17, y: 52.47 },
  { x: 82.42, y: 52.2 },
  { x: 82.68, y: 51.93 },
  { x: 82.95, y: 51.67 },
  { x: 83.27, y: 51.5 },
  { x: 83.6, y: 51.33 },
  { x: 83.94, y: 51.18 },
  { x: 84.28, y: 51.03 },
  { x: 84.63, y: 50.9 },
  { x: 84.98, y: 50.79 },
  { x: 85.35, y: 50.71 },
  { x: 85.71, y: 50.65 },
  { x: 86.08, y: 50.62 },
  { x: 86.45, y: 50.64 },
  { x: 86.82, y: 50.69 },
  { x: 87.18, y: 50.78 },
  { x: 87.53, y: 50.9 },
  { x: 87.86, y: 51.07 },
  { x: 88.16, y: 51.29 },
  { x: 88.44, y: 51.53 },
  { x: 88.71, y: 51.78 },
  { x: 88.94, y: 52.08 },
  { x: 89.15, y: 52.38 },
  { x: 89.33, y: 52.7 },
  { x: 89.51, y: 53.03 },
  { x: 89.67, y: 53.36 },
  { x: 89.84, y: 53.69 },
  { x: 90.01, y: 54.02 },
  { x: 90.18, y: 54.35 },
  { x: 90.36, y: 54.68 },
  { x: 90.55, y: 55.0 },
  { x: 90.75, y: 55.31 },
  { x: 90.96, y: 55.62 },
  { x: 91.18, y: 55.91 },
  { x: 91.4, y: 56.21 },
  { x: 91.65, y: 56.49 },
  { x: 91.9, y: 56.76 },
  { x: 92.16, y: 57.02 },
  { x: 92.43, y: 57.28 },
  { x: 92.71, y: 57.52 },
  { x: 92.99, y: 57.76 },
  { x: 93.28, y: 57.99 },
  { x: 93.58, y: 58.22 },
  { x: 93.88, y: 58.44 },
  { x: 94.18, y: 58.65 },
  { x: 94.49, y: 58.86 },
  { x: 94.8, y: 59.06 },
  { x: 95.11, y: 59.26 },
  { x: 95.43, y: 59.46 },
  { x: 95.74, y: 59.65 },
  { x: 96.07, y: 59.82 },
  { x: 96.4, y: 59.99 },
  { x: 96.73, y: 60.16 },
  { x: 97.07, y: 60.32 },
  { x: 97.41, y: 60.47 },
  { x: 97.75, y: 60.61 },
  { x: 98.1, y: 60.75 },
  { x: 98.45, y: 60.87 },
  { x: 98.8, y: 60.98 },
  { x: 99.16, y: 61.08 },
  { x: 99.52, y: 61.18 },
  { x: 99.88, y: 61.25 },
  { x: 100.24, y: 61.32 },
  { x: 100.61, y: 61.32 },
  { x: 100.98, y: 61.27 },
  { x: 101.35, y: 61.21 },
  { x: 101.71, y: 61.18 },
  { x: 102.08, y: 61.21 },
  { x: 102.45, y: 61.19 },
  { x: 102.83, y: 61.18 },
  { x: 103.2, y: 61.18 },
  { x: 103.57, y: 61.18 },
  { x: 103.94, y: 61.19 },
  { x: 104.31, y: 61.2 },
  { x: 104.68, y: 61.2 },
  { x: 105.05, y: 61.21 },
  { x: 105.42, y: 61.22 },
  { x: 105.79, y: 61.23 },
  { x: 106.17, y: 61.23 },
  { x: 106.54, y: 61.24 },
  { x: 106.91, y: 61.24 },
  { x: 107.28, y: 61.25 },
  { x: 107.65, y: 61.27 },
  { x: 108.02, y: 61.28 },
  { x: 108.39, y: 61.29 },
  { x: 108.76, y: 61.3 },
  { x: 109.13, y: 61.31 },
  { x: 109.5, y: 61.32 },
  { x: 109.87, y: 61.33 },
  { x: 110.25, y: 61.34 },
  { x: 110.62, y: 61.35 },
  { x: 110.99, y: 61.36 },
  { x: 111.36, y: 61.37 },
  { x: 111.73, y: 61.37 },
  { x: 112.1, y: 61.38 },
  { x: 112.47, y: 61.38 },
  { x: 112.84, y: 61.38 },
  { x: 113.21, y: 61.38 },
  { x: 113.58, y: 61.39 },
  { x: 113.96, y: 61.39 },
  { x: 114.33, y: 61.39 },
  { x: 114.7, y: 61.39 },
  { x: 115.07, y: 61.4 },
  { x: 115.44, y: 61.39 },
  { x: 115.81, y: 61.37 },
  { x: 116.18, y: 61.35 },
  { x: 116.55, y: 61.31 },
  { x: 116.92, y: 61.28 },
];


// Angles de rotation (degrés) selon la tangente à chaque point — avion orienté dans la direction du mouvement
function getPlaneRotations(path: { x: number; y: number }[]): number[] {
  const rotations: number[] = [];
  for (let i = 0; i < path.length; i++) {
    const prev = path[Math.max(0, i - 1)];
    const next = path[Math.min(path.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    // Angle en degrés : atan2(dy, dx) car y croît vers le bas ; CSS rotate sens horaire = positif
    // Theta 0 : à l'état initial l'avion est déjà rotationné de 40° dans le sens horaire
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI + 40;
    rotations.push(angleDeg);
  }
  return rotations;
}

// "Déroule" les angles pour éviter les sauts brusques dus au passage par ±180° (wrap 360°)
function unwrapAngles(angles: number[]): number[] {
  if (angles.length === 0) return angles;
  const unwrapped: number[] = [angles[0]];
  for (let i = 1; i < angles.length; i++) {
    let current = angles[i];
    let prev = unwrapped[i - 1];
    let delta = current - prev;

    // Si on saute de plus de 180° dans un sens, on corrige en ajoutant/enlevant 360°
    if (delta > 180) {
      current -= 360;
    } else if (delta < -180) {
      current += 360;
    }

    unwrapped.push(current);
  }
  return unwrapped;
}

const planeRotations = unwrapAngles(getPlaneRotations(planePath));

const PLANE_DURATION = 14;
const PLANE_REPEAT_DELAY = 2;
const HOVER_MAX_DURATION_MS = 3000; // max 3s en ralenti, puis retour vitesse normale
const HOVER_BLOCKED_DURATION_MS = 3000; // après ça, hover bloqué pendant 3s
const SEGMENT_SIZE = 5; // Nombre de points par segment pour la traînée
const TRAIL_DELAY = 0.5; // Délai (s) avant apparition de la traînée après le passage de l'avion
const TRAIL_FADE_DURATION = 0.5; // Durée (s) du fade de la traînée
const keyframes = Array.from({ length: planePath.length }, (_, i) => i / (planePath.length - 1));

function PlaneAlongPath({
  duration,
  isHovered,
  setIsHovered,
  progress,
}: {
  duration: number;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  progress: MotionValue<number>;
}) {
  const planeRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const hoverBlockedUntilRef = useRef(0);
  const hoverStartTimeRef = useRef(0);
  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const lastTimeRef = useRef<number>(0);
  const phaseRef = useRef<'animating' | 'delaying'>('animating');
  const delayEndTimeRef = useRef(0);

  const left = useTransform(progress, keyframes, planePath.map((p) => `${p.x}%`));
  const top = useTransform(progress, keyframes, planePath.map((p) => `${p.y}%`));
  const rotate = useTransform(progress, keyframes, planeRotations.map((r) => `${r}deg`));

  // Boucle manuelle : on ne relance jamais l'animation, on change juste la vitesse → plus de saut
  useEffect(() => {
    let rafId: number;
    lastTimeRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const dur = durationRef.current;

      if (phaseRef.current === 'delaying') {
        if (now >= delayEndTimeRef.current) {
          progress.set(0);
          phaseRef.current = 'animating';
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      let p = progress.get() + deltaSec / dur;
      if (p >= 1) {
        p = 1;
        progress.set(1);
        phaseRef.current = 'delaying';
        delayEndTimeRef.current = now + PLANE_REPEAT_DELAY * 1000;
      } else {
        progress.set(p);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  const handleMouseEnter = () => {
    const now = Date.now();
    if (now < hoverBlockedUntilRef.current) return;
    hoverStartTimeRef.current = now;
    isHoveredRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
  };

  // Mise à jour de la position du curseur
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Un seul intervalle (monté une fois) : lit les refs pour éviter les closures périmées
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHoveredRef.current) return;
      const now = Date.now();
      // Max 3s en hover : forcer sortie et bloquer le hover pendant 3s
      if (now - hoverStartTimeRef.current >= HOVER_MAX_DURATION_MS) {
        isHoveredRef.current = false;
        setIsHovered(false);
        hoverBlockedUntilRef.current = now + HOVER_BLOCKED_DURATION_MS;
        return;
      }
      const planeEl = planeRef.current;
      if (!planeEl) return;
      const rect = planeEl.getBoundingClientRect();
      const { x, y } = mousePosRef.current;
      const padding = 8;
      const inside =
        x >= rect.left - padding &&
        x <= rect.right + padding &&
        y >= rect.top - padding &&
        y <= rect.bottom + padding;
      if (!inside) {
        isHoveredRef.current = false;
        setIsHovered(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [setIsHovered]);

  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        ref={planeRef}
        className="absolute w-10 h-10 sm:w-12 sm:h-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left, top }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="w-full h-full"
          style={{ rotate, transformOrigin: 'center center' }}
        >
          <Image
            src="/avion.png"
            alt=""
            width={48}
            height={48}
            className="w-full h-full object-contain opacity-90 drop-shadow-sm"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

interface TrailSegmentProps {
  segmentPath: string;
  startIdx: number;
  progress: MotionValue<number>;
  duration: number;
}

function TrailSegment({ segmentPath, startIdx, progress, duration }: TrailSegmentProps) {
  // Position du segment le long de la trajectoire (0 -> début, 1 -> fin)
  const segmentProgress = startIdx / planePath.length;

  // Convertit les délais temporels (en secondes) en positions de progress [0,1]
  const appearProgress = Math.min(1, segmentProgress + TRAIL_DELAY / duration);
  const disappearProgress = Math.min(1, appearProgress + TRAIL_FADE_DURATION / duration);

  const times: number[] = [];
  const values: number[] = [];

  if (appearProgress > 0) {
    times.push(0);
    values.push(0);
  }

  if (appearProgress < 1) {
    times.push(Math.max(0, appearProgress - 0.001));
    values.push(0);

    times.push(appearProgress);
    values.push(1);

    if (disappearProgress < 1) {
      times.push(disappearProgress);
      values.push(1);

      times.push(Math.min(1, disappearProgress + 0.001));
      values.push(0);
    }
  }

  if (disappearProgress >= 1) {
    times.push(1);
    values.push(0);
  }

  const opacity = useTransform(
    progress,
    times.length > 0 ? times : [0, 1],
    values.length > 0 ? values : [0, 0]
  );

  return (
    <motion.path
      d={segmentPath}
      fill="none"
      stroke="#2563eb"
      strokeWidth="0.4"
      strokeDasharray="2 1"
      strokeLinecap="round"
      style={{
        opacity,
        filter: 'drop-shadow(0 0 1px rgba(37, 99, 235, 0.6))',
      }}
    />
  );
}

// Ordre au hover : 1 gants (gauche), 2 riz (droite)
const HEAD_HOVER_IMAGES = [
  { src: '/gants-bleu.png', alt: 'Gants', id: 'gants', label: 'fighting sports fan.' },
  { src: '/riz.png', alt: 'Riz', id: 'riz', label: 'Riz.' },
] as const;

export default function Hero({ 
  profileImage = '/photo_racim.png', 
  description = 'Si Smail Racim, Étudiant Ingénieur. Je ne fais pas que coder, je conçois des solutions. Fort d\'une maîtrise technique concrète (IA/Automation), je souhaite désormais appliquer cette rigueur opérationnelle au domaine de l\'Informatique et Ingénierie Mathématique.' 
}: HeroProps) {
  const planeProgress = useMotionValue(0);
  const [isPlaneHovered, setIsPlaneHovered] = useState(false);
  const planeDuration = isPlaneHovered ? PLANE_DURATION * 2 : PLANE_DURATION;
  const [headHoverIndex, setHeadHoverIndex] = useState(0);
  const [isHeadHovered, setIsHeadHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<-1 | 0 | 1>(-1);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Créer des segments de traînée qui apparaissent progressivement
  // Chaque segment apparaît 0.5s après le passage de l'avion et disparaît en 0.5s
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Traînée bleue hachurée derrière l'avion */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {Array.from({ length: Math.floor(planePath.length / SEGMENT_SIZE) }).map((_, segmentIndex) => {
            const startIdx = segmentIndex * SEGMENT_SIZE;
            const endIdx = Math.min(startIdx + SEGMENT_SIZE, planePath.length - 1);
            const segmentPath = planePath.slice(startIdx, endIdx + 1)
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ');

            return (
              <TrailSegment
                key={segmentIndex}
                segmentPath={segmentPath}
                startIdx={startIdx}
                progress={planeProgress}
                duration={planeDuration}
              />
            );
          })}
        </svg>
      </div>

      {/* Avion en papier animé le long du path avec rotation selon la tangente */}
      <PlaneAlongPath
        duration={planeDuration}
        isHovered={isPlaneHovered}
        setIsHovered={setIsPlaneHovered}
        progress={planeProgress}
      />
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Profile Image with Overlapping Button + images derrière la tête */}
        <div className="relative mb-8 flex flex-col items-center overflow-visible">
          {/* Wrapper même taille que la tête pour ne pas déplacer le bouton — overflow-visible pour les images qui dépassent */}
          <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] flex items-center justify-center overflow-visible">
            {/* Gants = milieu gauche, Riz = milieu droite — on ne voit qu'une petite portion */}
            {HEAD_HOVER_IMAGES.map((img, index) => {
              const isActive = isMobile
                ? mobileActiveIndex === index
                : isHeadHovered && index === headHoverIndex;
              const configs = [
                {
                  wrapper: { left: '28%', top: '50%', transform: 'translate(-50%, -50%)' },
                  animate: {
                    rotate: isActive ? -21 : 0,
                    x: isActive ? -76 : 0,
                    scale: isActive ? 1.5 : 0.9,
                  },
                  labelOffset: { x: -36, y: -18 },
                },
                {
                  wrapper: { right: '28%', top: '50%', transform: 'translate(50%, -50%)' },
                  animate: {
                    rotate: isActive ? 21 : 0,
                    x: isActive ? 76 : 0,
                    scale: isActive ? 1.5 : 0.9,
                  },
                  labelOffset: { x: 24, y: -12 },
                },
              ];
              const cfg = configs[index];
              const lo = cfg.labelOffset ?? { x: 0, y: -28 };
              const labelAnimate = {
                ...cfg.animate,
                x: (typeof cfg.animate.x === 'number' ? cfg.animate.x : 0) + lo.x,
                y: lo.y,
                opacity: isActive ? 1 : 0,
              };
              return (
                <div
                  key={img.src}
                  className="absolute w-14 h-14 sm:w-16 sm:h-16 pointer-events-none"
                  style={{ ...cfg.wrapper, zIndex: 1 }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    initial={false}
                    animate={cfg.animate}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </motion.div>
                  {/* Texte avec la même translation/rotation que l'image, décalé au-dessus */}
                  <motion.div
                    className="absolute left-1/2 bottom-full mb-0.5 -translate-x-1/2 whitespace-nowrap text-blue-600 text-[10px] sm:text-xs font-medium"
                    style={{ fontFamily: 'var(--font-canela-deck)' }}
                    initial={false}
                    animate={labelAnimate}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {img.label}
                  </motion.div>
                </div>
              );
            })}
            <div
              className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-white z-10 cursor-pointer touch-manipulation"
              onMouseEnter={() => !isMobile && setIsHeadHovered(true)}
              onMouseLeave={() => {
                if (!isMobile) {
                  setIsHeadHovered(false);
                  setHeadHoverIndex((i) => (i + 1) % HEAD_HOVER_IMAGES.length);
                }
              }}
              onClick={() => {
                if (isMobile) {
                  setMobileActiveIndex((i): -1 | 0 | 1 => (i === 1 ? -1 : (i + 1) as 0 | 1));
                }
              }}
              role={isMobile ? 'button' : undefined}
              aria-label={isMobile ? 'Afficher un détail' : undefined}
            >
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
                priority
                style={{ objectPosition: 'center 35%', transform: 'scale(0.90)' }}
              />
            </div>
          </div>

          {/* Overlapping Button — collé sous la tête, largeur fixe centrée */}
          <div className="relative -mt-8 z-20 flex justify-center">
            <AuditButton
              text="Contacte Moi"
              width={200}
              height={50}
              fontSize={16}
              link="#contact"
              className="cursor-cta"
            />
          </div>

        </div>

        {/* Headline and Description */}
        <div className="mt-8 sm:mt-12 max-w-2xl mx-auto px-1">
          {/* Headline with Canela Deck */}
          <h1 
            className="text-xl sm:text-2xl md:text-3xl font-normal text-black leading-tight mb-4 sm:mb-6"
            style={{ fontFamily: 'var(--font-canela-deck)' }}
          >
            Si Smail Racim,{' '}
            <span className="text-blue-600 relative inline-block">
              Étudiant Ingénieur
              {/* Soulignement ascendant - trait unique fluide */}
              <svg 
                className="absolute bottom--1.2 left-0 w-full h-3"
                viewBox="0 0 240 15" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                {/* Courbe convexe plus marquée */}
                <path 
                  d="M 5 13 C 60 10, 120 4, 235 7" 
                  stroke="#2563eb" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          
          {/* Subtitle with Inter */}
          <p 
            className="text-sm sm:text-base text-black leading-relaxed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {(() => {
              const text = description;
              // Extract the part after "Étudiant Ingénieur."
              const etudiantIndex = text.indexOf('Étudiant Ingénieur');
              const restOfText = etudiantIndex !== -1 
                ? text.substring(etudiantIndex + 'Étudiant Ingénieur'.length + 1).trim()
                : text;
              
              const parts = [];
              let lastIndex = 0;
              
              // Find "Informatique et Ingénierie Mathématique"
              const highlightStr = 'Informatique et Ingénierie Mathématique';
              const mathIndex = restOfText.indexOf(highlightStr);
              if (mathIndex !== -1) {
                if (mathIndex > lastIndex) {
                  parts.push(restOfText.substring(lastIndex, mathIndex));
                }
                parts.push(<span key="math" className="text-blue-600">{highlightStr}</span>);
                lastIndex = mathIndex + highlightStr.length;
              }
              
              // Add remaining text
              if (lastIndex < restOfText.length) {
                parts.push(restOfText.substring(lastIndex));
              }
              
              // If no highlights found, return original text
              return parts.length > 0 ? parts : restOfText;
            })()}
          </p>
        </div>
      </div>

      {/* Animated Arrow - renvoie vers la section projets */}
      <a
        href="#projects"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Voir les projets"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="rgba(37, 99, 235, 0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </a>
    </section>
  );
}
