import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuotationTableRowProps {
  item: any;
  type: 'quotation' | 'quote';
  onDelete: (id: string, type: 'quote' | 'quotation') => void;
  onStatusUpdate?: (quotationId: string, newStatus: 'approved' | 'rejected') => void;
}

export const QuotationTableRow = ({ 
  item, 
  type, 
  onDelete,
  onStatusUpdate 
}: QuotationTableRowProps) => {
  const renderQuoteItems = (items: any[]) => (
    <Card className="p-2">
      <ul className="text-sm space-y-1">
        {items?.map((item, index) => (
          <li key={index}>
            {item.food_items?.name} x{item.quantity}
            <span className="text-xs ml-2 text-muted-foreground">
              ({item.food_items?.dietary_preference}, {item.food_items?.course_type})
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );

  const renderDeleteButton = (id: string, type: 'quote' | 'quotation') => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the quote and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(id, type)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <tr>
      <td className="p-4">
        <div>
          <p className="font-medium">{type === 'quotation' ? item.profiles?.full_name : item.profiles?.full_name}</p>
          <p className="text-sm text-muted-foreground">{type === 'quotation' ? item.profiles?.email : item.profiles?.email}</p>
        </div>
      </td>
      <td className="p-4">
        <div>
          <p>Date: {item.party_date ? format(new Date(item.party_date), 'PPP') : 'N/A'}</p>
          <p>Location: {item.party_location || 'N/A'}</p>
          <p>Veg Guests: {item.veg_guests}</p>
          <p>Non-veg Guests: {item.non_veg_guests}</p>
        </div>
      </td>
      <td className="p-4">
        {renderQuoteItems(type === 'quotation' ? item.quotation_items : item.quote_items)}
      </td>
      <td className="p-4">
        <Badge
          variant={
            item.quote_status === 'approved'
              ? 'default'
              : item.quote_status === 'rejected'
              ? 'destructive'
              : 'secondary'
          }
        >
          {item.quote_status}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex space-x-2">
          {type === 'quotation' && item.quote_status === 'pending' && onStatusUpdate && (
            <>
              <Button
                size="sm"
                onClick={() => onStatusUpdate(item.id, 'approved')}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onStatusUpdate(item.id, 'rejected')}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          {renderDeleteButton(item.id, type)}
        </div>
      </td>
    </tr>
  );
};