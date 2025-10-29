'''
Business: Handles table booking requests for Gorkina cafe
Args: event - dict with httpMethod, body containing booking details
      context - object with request_id attribute
Returns: HTTP response with booking confirmation or error
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        name = body_data.get('name')
        phone = body_data.get('phone')
        booking_date = body_data.get('date')
        booking_time = body_data.get('time')
        guests = body_data.get('guests')
        
        if not all([name, phone, booking_date, booking_time, guests]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'All fields are required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            "INSERT INTO bookings (name, phone, booking_date, booking_time, guests) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, phone, booking_date, booking_time, guests)
        )
        
        result = cur.fetchone()
        booking_id = result['id']
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'booking_id': booking_id,
                'message': 'Booking created successfully'
            }),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        date_filter = params.get('date')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if date_filter:
            cur.execute(
                "SELECT * FROM bookings WHERE booking_date = %s ORDER BY booking_time",
                (date_filter,)
            )
        else:
            cur.execute(
                "SELECT * FROM bookings ORDER BY booking_date DESC, booking_time DESC LIMIT 50"
            )
        
        bookings = cur.fetchall()
        
        cur.close()
        conn.close()
        
        bookings_list = []
        for booking in bookings:
            bookings_list.append({
                'id': booking['id'],
                'name': booking['name'],
                'phone': booking['phone'],
                'date': str(booking['booking_date']),
                'time': booking['booking_time'],
                'guests': booking['guests'],
                'status': booking['status'],
                'created_at': str(booking['created_at'])
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'bookings': bookings_list}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
