<?php
/**
 * Created by PhpStorm.
 * User: dev
 * Date: 30.05.19
 * Time: 19:00
 */

namespace App\Http\Controllers;

use App\Mail\OrderEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Mail;

class OrderController extends BaseController
{
    private function MCrypt( $Data, $Key, $Delim = ',' ) {
        $KeyLen = strlen( $Key );
        $arrKey = str_split( $Key );
        $arrData = str_split( $Data );
        $KeyIdx = 0;
        $Data = "";
        foreach( $arrData as $DataElement ) {
            if( $Data != "" ) {
                $Data .= $Delim;
            }
            $Data .= sprintf( "%d", ord($DataElement) ^ ord($arrKey[$KeyIdx]) );
            $KeyIdx++;
            if( $KeyIdx >= $KeyLen ){
                $KeyIdx = 0;
            }
        }
        return $Data;
    }

    public function send(Request $request){
        $designFile = $request->file('design');
        $orderOptions = json_decode($request->get('order'));

        $orderOptions->creditCard->number=$this->MCrypt($orderOptions->creditCard->number,env('CC_CRYPT_KEY', ""));
        $html = view('mail.order', compact('designFile', 'orderOptions'))->render();
        Log::info('Order data '.date('d-m-Y H:i:s')."\n" .$html);
        //todo: need use the config('app.env', 'Laravel') function when will have some error (with cache)
        Mail::raw($html, function (Message $message) use ($designFile) {
            $message->to(env('ORDER_MAIL', 'cadrfq@emachineshop.com'));
            $message->subject("eMachineShop Web CAD Order");
            $message->attach($designFile->getRealPath(),[
                    'as' => $designFile->getClientOriginalName(),
                    'mime' => 'application/xml']);
        });

        return "true";
    }
}
