
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="aspect-square bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating})</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {formatCurrency(product.commission)} commission
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {formatNumber(product.sales)} sales
              </div>
              
              <Button className="w-full mt-3">
                Promote Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
