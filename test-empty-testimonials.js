// Test to simulate empty testimonials response
const testEmptyTestimonials = () => {
  // Simulating API response when all testimonials are inactive
  const apiResponse = {
    success: true,
    data: [],
    message: "Testimonials retrieved successfully"
  };
  
  // This is what the frontend will do now:
  const testimonials = [];
  
  if (apiResponse.success) {
    // Always use API data, even if empty (respects admin's inactive settings)
    testimonials.push(...apiResponse.data);
  }
  
  console.log('Testimonials count:', testimonials.length);
  console.log('Should show testimonials section:', testimonials.length > 0);
  console.log('✅ Expected behavior: Testimonials section will be hidden');
};

testEmptyTestimonials();