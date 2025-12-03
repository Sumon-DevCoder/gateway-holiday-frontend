# Analytics Usage Examples

এই file এ Google Analytics ব্যবহার করার practical examples দেওয়া আছে।

## Quick Start

```typescript
import { analytics } from "@/lib/analytics";

// Button click track করা
analytics.trackButtonClick("Book Now", "/package-details");

// Form submission track করা
analytics.trackFormSubmit("Contact Form", true);
```

## Complete Examples

### 1. Button Click Tracking

```typescript
"use client";

import { analytics } from "@/lib/analytics";

export function BookNowButton({ packageId }: { packageId: string }) {
  const handleClick = () => {
    analytics.trackButtonClick("Book Now", `/package/${packageId}`);
    // Your booking logic
  };

  return <button onClick={handleClick}>Book Now</button>;
}
```

### 2. Form Submission Tracking

```typescript
"use client";

import { analytics } from "@/lib/analytics";
import { useState } from "react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await submitForm(data);
      analytics.trackFormSubmit("Contact Form", true);
    } catch (error) {
      analytics.trackFormSubmit("Contact Form", false);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Package View Tracking

```typescript
"use client";

import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

export function PackageDetails({ package: pkg }: { package: Package }) {
  useEffect(() => {
    analytics.trackPackageView(pkg.id, pkg.name);
  }, [pkg.id, pkg.name]);

  return <div>...</div>;
}
```

### 4. Booking Tracking

```typescript
import { analytics } from "@/lib/analytics";

async function completeBooking(bookingData: BookingData) {
  try {
    const booking = await createBooking(bookingData);

    analytics.trackBooking(
      bookingData.type, // "Package Tour", "Visa", etc.
      booking.id,
      booking.totalAmount
    );

    return booking;
  } catch (error) {
    // Track failed booking attempt
    analytics.trackEvent("booking_failed", {
      booking_type: bookingData.type,
      error: error.message,
    });
    throw error;
  }
}
```

### 5. Custom Event Tracking

```typescript
import { trackEvent } from "@/lib/analytics";

// Custom event with parameters
trackEvent("video_play", {
  video_title: "Travel Guide",
  video_duration: 120,
  video_category: "Tutorial",
});
```
