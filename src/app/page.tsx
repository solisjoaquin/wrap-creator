"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, ShoppingCart, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const wrapTypes = [
  { id: "meat", name: "Wrap de Carne", price: 7000.0 },
  { id: "chicken", name: "Wrap de Pollo", price: 7000.0 },
  { id: "vegan", name: "Wrap Vegetariano", price: 6000.0 },
];

const vegetables = [
  { id: "lettuce", name: "Lechuga", price: 0.0 },
  { id: "tomato", name: "Tomate", price: 0.0 },
  { id: "cucumber", name: "Repollo", price: 0.0 },
  { id: "onion", name: "Cebolla", price: 0.0 },
  { id: "bell-pepper", name: "Zanahoria", price: 0.0 },
];

const toppings = [
  { id: "cheese", name: "Queso", price: 0.0 },
  { id: "ham", name: "Jamon", price: 0.0 },
  { id: "bacon", name: "Tocino", price: 0.0 },
  { id: "egg", name: "Huevo", price: 0.0 },
];

const sauces = [
  { id: "mayo", name: "Mayonesa", price: 0.0 },
  { id: "mustard", name: "Mostaza", price: 0.0 },
  { id: "ketchup", name: "Ketchup", price: 0.0 },
  { id: "ranch", name: "Albahaca", price: 0.0 },
  { id: "bbq", name: "Ajo", price: 0.0 },
];

const premiumOptions = [
  { id: "avocado", name: "Palta", price: 500 },
  { id: "feta", name: "Queso extra", price: 300 },
  { id: "sun-dried-tomato", name: "Sun-dried Tomato", price: 300 },
  { id: "olives", name: "Aceitunas", price: 500 },
  { id: "roasted-peppers", name: "Roasted Red Peppers", price: 150 },
];

type WrapItem = {
  id: string;
  name: string;
  price: number;
};

type Wrap = {
  id: string;
  type: WrapItem;
  items: WrapItem[];
  total: number;
};

export default function WrapStore() {
  const [selectedWrapType, setSelectedWrapType] = useState<WrapItem | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<WrapItem[]>([]);
  const [cart, setCart] = useState<Wrap[]>([]);

  const handleWrapTypeChange = (typeId: string) => {
    const selectedType = wrapTypes.find((type) => type.id === typeId);
    setSelectedWrapType(selectedType || null);
  };

  const handleItemToggle = (item: WrapItem) => {
    setSelectedItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        if (toppings.some((t) => t.id === item.id)) {
          const currentToppings = prev.filter((i) =>
            toppings.some((t) => t.id === i.id)
          );
          if (currentToppings.length >= 2) {
            return prev;
          }
        }
        return [...prev, item];
      }
    });
  };

  const addToCart = () => {
    if (!selectedWrapType || selectedItems.length === 0) return;

    const newWrap: Wrap = {
      id: Date.now().toString(),
      type: selectedWrapType,
      items: selectedItems,
      total:
        selectedWrapType.price +
        selectedItems.reduce((sum, item) => sum + item.price, 0),
    };
    setCart((prev) => [...prev, newWrap]);
    setSelectedWrapType(null);
    setSelectedItems([]);
  };

  const removeFromCart = (wrapId: string) => {
    setCart((prev) => prev.filter((wrap) => wrap.id !== wrapId));
  };

  const sendOrder = () => {
    console.log("Sending order:", cart);
    alert("Your order has been sent to the store!");
    setCart([]);
  };

  const renderCheckboxGroup = (title: string, items: WrapItem[]) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {items.map((item) => {
        const isChecked = selectedItems.some((i) => i.id === item.id);
        const isToppingMaxReached =
          title === "Toppings" &&
          selectedItems.filter((i) => toppings.some((t) => t.id === i.id))
            .length >= 2 &&
          !isChecked;
        return (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={isChecked}
              onCheckedChange={() => handleItemToggle(item)}
              disabled={isToppingMaxReached}
            />
            <Label
              htmlFor={item.id}
              className={`flex-grow ${
                isToppingMaxReached ? "text-muted-foreground" : ""
              }`}
            >
              {item.name}
            </Label>
            <span className="text-sm text-muted-foreground">
              ${item.price.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto md:my-4">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg relative">
        <CardTitle className="text-3xl font-bold">Fuua</CardTitle>
        <CardDescription className="text-lg text-primary-foreground/80">
          Personaliza tu wrap
        </CardDescription>
        <div
          className="absolute top-4 right-4"
          // animate={cart.length === 0 ? { y: [0, -10, 0] } : {}}
          // transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cart.length}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Como funciona</AlertTitle>
          <AlertDescription>
            Selecciona el tipo de wrap que deseas y personalízalo con tus
            opciones favoritas. Una vez que estés satisfecho, agrégalo al
            carrito y envía tu pedido.
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Selecciona el tipo de wrap
          </h3>
          <RadioGroup
            onValueChange={handleWrapTypeChange}
            value={selectedWrapType?.id}
          >
            {wrapTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id} className="flex-grow">
                  {type.name}
                </Label>
                <span className="text-sm text-muted-foreground">
                  ${type.price.toFixed(2)}
                </span>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollArea className="h-[400px] pr-4">
            {renderCheckboxGroup("Verduras", vegetables)}
            <Separator className="my-4" />
            {renderCheckboxGroup("Toppings", toppings)}
          </ScrollArea>
          <ScrollArea className="h-[400px] pr-4">
            {renderCheckboxGroup("Salsas", sauces)}
            <Separator className="my-4" />
            {renderCheckboxGroup("Extras", premiumOptions)}
          </ScrollArea>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total: $
            {(
              (selectedWrapType?.price || 0) +
              selectedItems.reduce((sum, item) => sum + item.price, 0)
            ).toFixed(2)}
          </div>
          <Button
            onClick={addToCart}
            disabled={!selectedWrapType || selectedItems.length === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Agregar a la orden
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start space-y-4 bg-muted/50 rounded-b-lg p-6">
        <h3 className="text-xl font-semibold">Tu pedido</h3>
        {cart.length === 0 ? (
          <p className="text-muted-foreground">No tienes nada en tu pedido</p>
        ) : (
          <ScrollArea className="w-full h-[300px]">
            {cart.map((wrap, index) => (
              <div
                key={wrap.id}
                className="flex justify-between items-start mb-4"
              >
                <div>
                  <h4 className="font-semibold">
                    {wrap.type.name} #{index + 1}
                  </h4>
                  <ul className="text-sm text-muted-foreground">
                    {wrap.items.map((item) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold">
                    ${wrap.total.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(wrap.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
        <div className="w-full flex justify-between items-center mt-4">
          <div className="text-lg font-semibold">
            Total: ${cart.reduce((sum, wrap) => sum + wrap.total, 0).toFixed(2)}
          </div>
          <Button onClick={sendOrder} disabled={cart.length === 0}>
            <Send className="mr-2 h-4 w-4" /> Crear orden
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
