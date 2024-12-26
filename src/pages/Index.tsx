import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => navigate('/')}
          >
            Restaurant Manager
          </h1>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="secondary"
              onClick={() => navigate('/restaurant')}
              className="w-full sm:w-auto"
            >
              Restaurant Menu
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto"
            >
              Admin Dashboard
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate('/chef')}
              className="w-full sm:w-auto"
            >
              Chef Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">Welcome to Restaurant Manager</h2>
            <p className="text-lg text-gray-600">
              Choose your destination to get started:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Restaurant Menu</h3>
                <p className="text-gray-600 mb-4">Browse our delicious menu and place your order</p>
                <Button 
                  variant="default"
                  onClick={() => navigate('/restaurant')}
                  className="w-full"
                >
                  View Menu
                </Button>
              </div>
              
              <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Chef Dashboard</h3>
                <p className="text-gray-600 mb-4">Manage orders and update menu items</p>
                <Button 
                  variant="default"
                  onClick={() => navigate('/chef')}
                  className="w-full"
                >
                  Chef Portal
                </Button>
              </div>
              
              <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
                <p className="text-gray-600 mb-4">Manage restaurant operations and staff</p>
                <Button 
                  variant="default"
                  onClick={() => navigate('/admin')}
                  className="w-full"
                >
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;