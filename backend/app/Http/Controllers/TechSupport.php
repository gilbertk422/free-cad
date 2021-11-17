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

class TechSupport extends BaseController
{

    private function buildHTML($request, $view, $subject){
        $designFile = $request->file('design');
        $category = $request->get('category');
        $email = $request->get('email');
        $message = $request->get('message');

        $html = view('mail.support', compact('designFile', 'category', 'email', 'message'))->render();
        Log::info($view.' '.date('d-m-Y H:i:s')."\n" .$html);
        Mail::raw($html, function (Message $message) use ($designFile, $email, $category, $subject) {

            $emails = explode('|',env('ADMIN_MAIL', 'panasencowork@gmail.com'));

            $message->to($emails);
            $message->subject($subject.$category);
            $message->from($email, 'User: '.$email);
            if($designFile) {
                $message->attach($designFile->getRealPath(), [
                    'as' => $designFile->getClientOriginalName(),
                    'mime' => 'application/xml']);
            }
        });

        return "true";
    }

    public function feedback(Request $request){
        return $this->buildHTML($request, "mail.feedback", "eMachineShop Web CAD | feedback | ");
    }

    public function appeal(Request $request){
        return $this->buildHTML($request, "mail.support", "eMachineShop Web CAD | tech support request | ");
    }
}
