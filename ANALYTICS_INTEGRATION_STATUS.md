# Analytics Integration Status (একীভূতকরণ অবস্থা)

## 📋 কেন `analytics.ts` ফাইল তৈরি করা হয়েছে?

আপনার প্রজেক্টে `src/components/analytics/README.md` file এ `@/lib/analytics` import করার উদাহরণ ছিল, কিন্তু **আসলে সেই file টি ছিল না**। তাই আমি সেই file টি তৈরি করেছি যাতে আপনি README তে দেখানো examples গুলো ব্যবহার করতে পারেন।

## ❌ বর্তমান অবস্থা: **কোনো file এ connect করা নেই**

বর্তমানে `analytics.ts` file টি **কোনো component বা page এ ব্যবহার করা হচ্ছে না**। এটি শুধু ready আছে ব্যবহার করার জন্য।

## ✅ কোথায় connect করা উচিত:

### 1. **Contact Form** (`src/app/contact-us/page.tsx`)
```typescript
// Line 92-110 এর পরে add করুন:
import { analytics } from "@/lib/analytics";

// Success হলে:
analytics.trackFormSubmit("Contact Form", true);

// Error হলে:
analytics.trackFormSubmit("Contact Form", false);
```

### 2. **Booking Form** (`src/app/booking-form/page.tsx`)
```typescript
// Line 130 এর পরে add করুন:
import { analytics } from "@/lib/analytics";

// Booking start হলে:
analytics.trackBookingStart(
  packageData.id,
  packageData.title,
  packageData.price,
  formData.persons
);

// Booking success হলে:
analytics.trackBooking(
  "Package Tour",
  result.data.bookingId,
  totalAmount
);
```

### 3. **Query Forms** (`src/components/forms/`)
- `HajjUmrahForm.tsx`
- `PackageTourForm.tsx`

```typescript
import { analytics } from "@/lib/analytics";

// Form submit success হলে:
analytics.trackFormSubmit("Hajj Umrah Query", true);
analytics.trackFormSubmit("Package Tour Query", true);
```

### 4. **Package Details Page**
```typescript
import { analytics } from "@/lib/analytics";

useEffect(() => {
  analytics.trackPackageView(
    package.id,
    package.name,
    package.price,
    package.category
  );
}, [package]);
```

### 5. **Search Functionality**
```typescript
import { analytics } from "@/lib/analytics";

// Search form submit হলে:
analytics.trackSearch(searchTerm, "package", resultsCount);
```

## 🔗 কিভাবে Connect করবেন:

### Step 1: Import করুন
```typescript
import { analytics } from "@/lib/analytics";
```

### Step 2: Event Track করুন
```typescript
// Button click হলে
analytics.trackButtonClick("Book Now", "/package-details");

// Form submit হলে
analytics.trackFormSubmit("Contact Form", true);

// Package view হলে
analytics.trackPackageView(packageId, packageName, price);
```

## 📊 Google Analytics Dashboard এ দেখতে পাবেন:

একবার connect করলে আপনি দেখতে পাবেন:
- ✅ কতজন form submit করেছে
- ✅ কতজন booking start করেছে
- ✅ কতজন booking complete করেছে
- ✅ কোন package সবচেয়ে বেশি view হয়েছে
- ✅ কোন button সবচেয়ে বেশি click হয়েছে

## ⚠️ Important Note:

**বর্তমানে শুধু Google Analytics Script load হচ্ছে** (`GoogleAnalyticsScript.tsx`), কিন্তু **কোনো custom events track করা হচ্ছে না**। 

`analytics.ts` file টি ব্যবহার করলে আপনি detailed tracking পাবেন যা আপনার business এর জন্য খুবই useful হবে।

---

**Next Step:** আপনি চাইলে আমি এই file গুলোতে analytics integration করে দিতে পারি। বলুন কোন file গুলোতে add করব?


