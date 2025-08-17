import { NextResponse } from 'next/server';
import { getWalletTransactions } from '@/lib/moralis';

function validateEthereumAddress(address) {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}

function validateDateRange(fromDate, toDate) {
  const errors = [];
  
  if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const now = new Date();
    
    if (isNaN(from.getTime())) {
      errors.push('Invalid fromDate format');
    }
    
    if (isNaN(to.getTime())) {
      errors.push('Invalid toDate format');
    }
    
    if (from > now) {
      errors.push('fromDate cannot be in the future');
    }
    
    if (to > now) {
      errors.push('toDate cannot be in the future');
    }
    
    if (from >= to) {
      errors.push('fromDate must be before toDate');
    }
    
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    if (from < oneYearAgo) {
      errors.push('Date range cannot exceed 1 year');
    }
  }
  
  return errors;
}

function getDateRange(timeRange) {
  const to = new Date();
  let from = new Date();

  switch (timeRange) {
    case '7days':
      from.setDate(to.getDate() - 7);
      break;
    case '30days':
      from.setDate(to.getDate() - 30);
      break;
    case '90days':
      from.setDate(to.getDate() - 90);
      break;
    default:
      from.setDate(to.getDate() - 7); // Default to 7 days
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

export async function GET(request, { params }) {
  const startTime = Date.now();
  let requestId;

  try {
    requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { address } = params;
    const url = new URL(request.url);

    const timeRange = url.searchParams.get('timeRange') || '7days';
    const customStart = url.searchParams.get('customStart');
    const customEnd = url.searchParams.get('customEnd');

    console.log(`API Request started`, {
      requestId,
      address: address?.slice(0, 10) + '...',
      timeRange,
      customStart,
      customEnd,
    });

    if (!address || !validateEthereumAddress(address)) {
      return NextResponse.json(
        {
          error: 'Invalid Ethereum address',
          message: 'Please provide a valid 40-character hexadecimal Ethereum address',
          requestId,
        },
        { status: 400 }
      );
    }

    // Compute from and to dates
    let from, to;
    if (customStart && customEnd) {
      from = customStart;
      to = customEnd;
    } else {
      ({ from, to } = getDateRange(timeRange));
    }

    // Validate date range
    const dateValidationErrors = validateDateRange(from, to);
    if (dateValidationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Date validation failed',
          message: dateValidationErrors.join('; '),
          requestId,
        },
        { status: 400 }
      );
    }

    console.log('Fetching transactions with validated params:', {
      requestId,
      address: address.slice(0, 10) + '...',
      fromDate: from,
      toDate: to,
    });

    const data = await getWalletTransactions(address, from, to);

    const processingTime = Date.now() - startTime;

    const response = {
      ...data,
      request_metadata: {
        request_id: requestId,
        processing_time_ms: processingTime,
        api_version: '2.0',
        timestamp: new Date().toISOString(),
        parameters: {
          address: address.slice(0, 10) + '...',
          time_range: timeRange,
          custom_start: customStart,
          custom_end: customEnd,
        },
      },
    };

    console.log(`API Request completed successfully`, {
      requestId,
      transactionCount: data.transactions?.length || 0,
      processingTime,
    });

    return NextResponse.json(response);
  } catch (error) {
    const processingTime = Date.now() - startTime;

    console.error('API Error Details:', {
      requestId,
      message: error.message,
      stack: error.stack,
      name: error.name,
      processingTime,
    });

    let statusCode = 500;
    let errorCategory = 'internal_error';
    let userMessage = 'An internal error occurred while processing your request';

    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      statusCode = 503;
      errorCategory = 'service_unavailable';
      userMessage = 'External service is currently unavailable';
    } else if (error.message?.includes('Invalid address') || error.message?.includes('validation')) {
      statusCode = 400;
      errorCategory = 'validation_error';
      userMessage = 'Invalid request parameters';
    } else if (error.message?.includes('timeout')) {
      statusCode = 504;
      errorCategory = 'timeout';
      userMessage = 'Request timed out. Please try again.';
    }

    const errorResponse = {
      error: errorCategory,
      message: userMessage,
      request_id: requestId,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.debug = {
        original_message: error.message,
        stack: error.stack,
      };
    }

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}