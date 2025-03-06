import { useState, useEffect, useCallback } from 'react';

// Define error types for better type safety
export enum LocationErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  UNKNOWN = 'UNKNOWN',
}

// Extend the location type to include accuracy and timestamp
export interface LocationType {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationError {
  type: LocationErrorType;
  message: string;
}

interface LocationState {
  location: LocationType | null;
  error: LocationError | null;
  loading: boolean;
}

const GEOLOCATION_ERRORS = {
  [LocationErrorType.PERMISSION_DENIED]: 'Байршлын хандалтыг хаасан. Үүнийг хөтчийн тохиргооноос идэвхжүүлнэ үү.',
  [LocationErrorType.POSITION_UNAVAILABLE]: 'Байршлын мэдээллийг авах боломжгүй байна.',
  [LocationErrorType.TIMEOUT]: 'Байршил тодорхойлох хугацаа хэтэрсэн.',
  [LocationErrorType.BROWSER_NOT_SUPPORTED]: 'Газарзүйн байршлыг таны хөтөч дэмждэггүй.',
  [LocationErrorType.UNKNOWN]: 'Байршил тодорхойлоход алдаа гарлаа.',
};

const useCurrentLocation = (permissionGranted: boolean) => {
  const [state, setState] = useState<LocationState>({
    location: null,
    error: null,
    loading: false,
  });

  const handleError = useCallback((error: GeolocationPositionError | Error) => {
    let errorType: LocationErrorType;

    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorType = LocationErrorType.PERMISSION_DENIED;
          break;
        case error.POSITION_UNAVAILABLE:
          errorType = LocationErrorType.POSITION_UNAVAILABLE;
          break;
        case error.TIMEOUT:
          errorType = LocationErrorType.TIMEOUT;
          break;
        default:
          errorType = LocationErrorType.UNKNOWN;
      }
    } else {
      errorType = LocationErrorType.UNKNOWN;
    }

    setState((prev) => ({
      ...prev,
      loading: false,
      error: {
        type: errorType,
        message: GEOLOCATION_ERRORS[errorType],
      },
    }));
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: {
          type: LocationErrorType.BROWSER_NOT_SUPPORTED,
          message: GEOLOCATION_ERRORS[LocationErrorType.BROWSER_NOT_SUPPORTED],
        },
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result) => {
        if (result.state === 'denied') {
          throw new Error(GEOLOCATION_ERRORS[LocationErrorType.PERMISSION_DENIED]);
        }

        // Watch for permission changes
        result.addEventListener('change', () => {
          if (result.state === 'denied') {
            handleError(new Error(GEOLOCATION_ERRORS[LocationErrorType.PERMISSION_DENIED]));
          }
        });

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setState((prev) => ({
              ...prev,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
              },
              loading: false,
              error: null,
            }));
          },
          handleError,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          },
        );
      })
      .catch(handleError);
  }, [handleError]);

  useEffect(() => {
    if (permissionGranted) {
      getLocation();
    } else {
      setState((prev) => ({
        ...prev,
        error: {
          type: LocationErrorType.PERMISSION_DENIED,
          message: GEOLOCATION_ERRORS[LocationErrorType.PERMISSION_DENIED],
        },
      }));
    }
  }, [permissionGranted, getLocation]);

  // Return both the state and a method to retry getting the location
  return {
    ...state,
    retry: getLocation,
  };
};

export default useCurrentLocation;
