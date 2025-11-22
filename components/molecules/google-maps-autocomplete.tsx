"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/atoms/input";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface GoogleMapsAutocompleteProps {
  value: string;
  latitude?: string | null;
  longitude?: string | null;
  onSelect: (address: string, lat: string, lng: string) => void;
  onChange?: (address: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function GoogleMapsAutocomplete({
  value,
  latitude,
  longitude,
  onSelect,
  onChange,
  placeholder = "Nhập địa chỉ...",
  className,
  disabled = false,
}: GoogleMapsAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const onSelectRef = useRef(onSelect);

  // Cập nhật ref khi onSelect thay đổi
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current) {
      console.warn("Input ref chưa sẵn sàng");
      return false;
    }

    if (!window.google?.maps?.places) {
      console.warn("Google Maps Places API chưa sẵn sàng");
      return false;
    }

    // Xóa autocomplete cũ nếu có
    if (autocompleteRef.current) {
      try {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      } catch (e) {
        // Ignore error
      }
    }

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "vn" },
          fields: ["formatted_address", "geometry", "name"],
          types: ["address"],
        }
      );

      autocompleteRef.current = autocomplete;

      // Attach listener ngay lập tức, không delay
      const listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          console.warn("Place không có geometry hoặc location", place);
          return;
        }

        try {
          const location = place.geometry.location;
          let lat: number;
          let lng: number;

          // Xử lý cả LatLng object và LatLngLiteral
          if (typeof location.lat === "function") {
            lat = location.lat();
            lng = location.lng();
          } else {
            lat = location.lat as number;
            lng = location.lng as number;
          }

          const address = place.formatted_address || place.name || inputRef.current?.value || "";

          // Convert sang string với đủ số thập phân (8 chữ số sau dấu phẩy)
          const latStr = lat.toFixed(8);
          const lngStr = lng.toFixed(8);

          console.log("Place selected:", { address, lat: latStr, lng: lngStr });
          onSelectRef.current(address, latStr, lngStr);
        } catch (error) {
          console.error("Lỗi khi lấy tọa độ từ place:", error);
        }
      });

      setIsReady(true);
      console.log("Autocomplete đã được khởi tạo thành công, listener đã attach");
      return true;
    } catch (error) {
      console.error("Lỗi khi khởi tạo Autocomplete:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!inputRef.current || disabled) return;

    let checkInterval: NodeJS.Timeout | null = null;
    let cleanupCallback: (() => void) | null = null;

    const loadGoogleMaps = () => {
      // Nếu Google Maps đã sẵn sàng, khởi tạo ngay (không delay)
      if (window.google && window.google.maps && window.google.maps.places) {
        // Sử dụng requestAnimationFrame để đảm bảo DOM đã render xong
        requestAnimationFrame(() => {
          initializeAutocomplete();
        });
        return;
      }

      // Kiểm tra xem script đã được load chưa
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api/js"]'
      );

      if (existingScript) {
        // Script đã tồn tại, đợi nó load xong
        let attempts = 0;
        const maxAttempts = 50; // 5 giây max

        checkInterval = setInterval(() => {
          attempts++;
          if (window.google?.maps?.places) {
            if (checkInterval) clearInterval(checkInterval);
            // Khởi tạo ngay khi API sẵn sàng
            requestAnimationFrame(() => {
              initializeAutocomplete();
            });
          } else if (attempts >= maxAttempts) {
            if (checkInterval) clearInterval(checkInterval);
            console.error("Timeout: Google Maps API không load được");
          }
        }, 50); // Giảm interval xuống 50ms để check nhanh hơn

        return;
      }

      // Tạo script mới
      const script = document.createElement("script");
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.warn("Google Maps API key chưa được cấu hình");
        return;
      }

      // Tạo unique callback name để tránh conflict
      const callbackName = `initGoogleMaps_${Date.now()}`;

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;

      (window as any)[callbackName] = () => {
        delete (window as any)[callbackName];
        // Khởi tạo ngay khi callback được gọi
        requestAnimationFrame(() => {
          if (inputRef.current) {
            initializeAutocomplete();
          }
        });
      };

      script.onerror = () => {
        console.error("Không thể load Google Maps API");
        delete (window as any)[callbackName];
      };

      document.head.appendChild(script);
      cleanupCallback = () => {
        delete (window as any)[callbackName];
      };
    };

    loadGoogleMaps();

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (cleanupCallback) {
        cleanupCallback();
      }
      if (autocompleteRef.current && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (e) {
          // Ignore error
        }
      }
    };
  }, [disabled, initializeAutocomplete]);

  // Đảm bảo autocomplete được khởi tạo khi input được focus hoặc click
  useEffect(() => {
    const input = inputRef.current;
    if (!input || disabled) return;

    const handleInteraction = () => {
      // Nếu autocomplete chưa được khởi tạo và Google Maps đã sẵn sàng, khởi tạo ngay
      if (!autocompleteRef.current && window.google?.maps?.places) {
        requestAnimationFrame(() => {
          initializeAutocomplete();
        });
      }
    };

    // Listen cả focus và click để đảm bảo autocomplete sẵn sàng
    input.addEventListener("focus", handleInteraction);
    input.addEventListener("click", handleInteraction);

    return () => {
      input.removeEventListener("focus", handleInteraction);
      input.removeEventListener("click", handleInteraction);
    };
  }, [disabled, initializeAutocomplete]);

  // Đảm bảo autocomplete được khởi tạo khi user bắt đầu gõ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);

    // Nếu autocomplete chưa được khởi tạo và Google Maps đã sẵn sàng, khởi tạo ngay
    if (!autocompleteRef.current && window.google?.maps?.places && !disabled) {
      requestAnimationFrame(() => {
        initializeAutocomplete();
      });
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Icons.mapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          className={cn("pl-10", className)}
          disabled={disabled}
          onChange={handleInputChange}
        />
      </div>
      {latitude && longitude && (
        <p className="mt-1 text-xs text-muted-foreground">
          Tọa độ: {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
        </p>
      )}
    </div>
  );
}

