export default function formatShortName(fullName: string): string {
  // Return empty string if input is falsy
  if (!fullName || typeof fullName !== "string") {
    return "";
  }

  // Trim whitespace
  const trimmedName = fullName.trim();

  // Check if name follows the expected format
  if (!trimmedName.includes(",")) {
    return trimmedName; // Return as-is if no comma (invalid format)
  }

  // Split into last name and first+middle parts
  const [lastName, firstMiddle] = trimmedName.split(",").map((part) => part.trim());

  if (!firstMiddle) {
    return lastName; // If no first name, return just last name
  }

  // Split first+middle into first name and middle initial
  const nameParts = firstMiddle.split(" ").filter((part) => part.length > 0);

  if (nameParts.length === 0) {
    return lastName; // If no first name parts, return just last name
  }

  // Extract first name and middle initial
  const firstName = nameParts[0];
  const middleInitial = nameParts.length > 1 ? nameParts[1] : "";

  // Format the shortened name
  if (firstName && middleInitial) {
    // Both first name and middle initial exist
    const firstInitial = firstName.charAt(0).toUpperCase();
    return `${lastName}, ${firstInitial}. ${middleInitial}`;
  } else if (firstName) {
    // Only first name exists
    const firstInitial = firstName.charAt(0).toUpperCase();
    return `${lastName}, ${firstInitial}.`;
  } else {
    // Fallback
    return lastName;
  }
}
