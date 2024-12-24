export const FooterSection = () => {
  return (
    <footer className="bg-secondary text-white py-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="mb-2">123 Restaurant Street</p>
          <p className="mb-2">City, State 12345</p>
          <p className="mb-2">Phone: (123) 456-7890</p>
          <p>Email: info@restaurant.com</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Hours</h3>
          <p className="mb-2">Monday - Friday: 11am - 10pm</p>
          <p className="mb-2">Saturday: 10am - 11pm</p>
          <p>Sunday: 10am - 9pm</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="space-y-2">
            <p>Facebook</p>
            <p>Instagram</p>
            <p>Twitter</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-white/20 text-center">
        <p>&copy; 2024 Restaurant Name. All rights reserved.</p>
      </div>
    </footer>
  );
};