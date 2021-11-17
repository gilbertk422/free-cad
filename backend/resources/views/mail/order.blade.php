eMachineShop Web CAD Order

Name: {{$orderOptions->shippingRequisites->firstName}} {{$orderOptions->shippingRequisites->lastName}} {{$orderOptions->shippingRequisites->businessName}}
Street: {{$orderOptions->shippingRequisites->address->street}}
City: {{$orderOptions->shippingRequisites->address->city}}
State: {{$orderOptions->shippingRequisites->address->state}}
ZipCode: {{$orderOptions->shippingRequisites->address->zipCode}}
Country: {{$orderOptions->shippingRequisites->address->country}}
Phone: {{$orderOptions->shippingRequisites->phone}}
Email: {{$orderOptions->shippingRequisites->email}}
@if(isset($orderOptions->billingRequisites))
Bill name: {{$orderOptions->billingRequisites->firstName}} {{$orderOptions->billingRequisites->lastName}} {{$orderOptions->billingRequisites->businessName}}
Bill street: {{$orderOptions->billingRequisites->address->street}}
Bill city: {{$orderOptions->billingRequisites->address->city}}
Bill state: {{$orderOptions->billingRequisites->address->state}}
Bill zipCode: {{$orderOptions->billingRequisites->address->zipCode}}
Bill country: {{$orderOptions->billingRequisites->address->country}}
Bill phone: {{$orderOptions->billingRequisites->phone}}
Bill email: {{$orderOptions->billingRequisites->email}}
Quantity: {{$orderOptions->quantity}}
Approximate Dimension: {{$orderOptions->dimension}}
Material: {{$orderOptions->material->name}}
@endif
@if(isset($orderOptions->finish))
    Finish: {{$orderOptions->finish->name}}
@endif
Terms: on
PaymentType: {{$orderOptions->pymentType}}
CheckOrPONo: {{$orderOptions->checkOrPONo}}
Ccname: {{$orderOptions->creditCard->ownername}}
Ccnumber: {{$orderOptions->creditCard->number}}
Ccmonth: {{$orderOptions->creditCard->month}}
Ccyear: {{$orderOptions->creditCard->year}}
Cvvnumber: {{$orderOptions->creditCard->CCV}}
Additional instructions: TEST
Function of Part: {{$orderOptions->functionOfPart}}
Permissions: no
ShippingMethod: {{$orderOptions->shipping->name}}
ShippingPrice: ${{$orderOptions->shipping->price}}
ShippingMethodID: {{$orderOptions->shipping->id}}
TotalCost: ${{$orderOptions->totalCost}}
BusinessDays: {{$orderOptions->businessDays}}
