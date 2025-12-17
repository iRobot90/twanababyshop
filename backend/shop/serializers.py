from rest_framework import serializers
from .models import Category, Product, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            image_url = instance.image.url
            # If it's already an absolute URL (from seed data), clean it up
            if 'http' in str(instance.image):
                 representation['image'] = str(instance.image)
            # If it was prefixed by Django media, and contains http, strip the prefix
            elif '/media/https' in image_url:
                 representation['image'] = image_url.replace('/media/', '')
        return representation

class ProductSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'category', 'category_id', 'name', 'slug', 'image', 'description', 'price', 'age_group', 'available', 'created', 'updated']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            # Check if the raw database value looks like a URL
            if str(instance.image).startswith('http'):
                representation['image'] = str(instance.image)
        return representation

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    cart_items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )
    
    class Meta:
        model = Order
        fields = ['id', 'first_name', 'last_name', 'email', 'address', 'postal_code', 'city', 'created', 'updated', 'paid', 'items', 'cart_items']

    def create(self, validated_data):
        cart_items_data = validated_data.pop('cart_items')
        order = Order.objects.create(**validated_data)
        for item_data in cart_items_data:
            OrderItem.objects.create(
                order=order,
                product_id=item_data['product_id'],
                price=item_data['price'],
                quantity=item_data['quantity']
            )
        return order
