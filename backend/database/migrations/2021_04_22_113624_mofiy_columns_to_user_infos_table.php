<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MofiyColumnsToUserInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_infos', function (Blueprint $table) {            
            $table->dropColumn('first_name');
            $table->dropColumn('middle_name');
            $table->dropColumn('last_name');
            $table->dropColumn('address');
            $table->dropColumn('vehicle_year');
            $table->dropColumn('vehicle_make');
            $table->dropColumn('vehicle_model');
            $table->dropColumn('vehicle_trim');
            $table->dropColumn('vehicle_color');
            $table->dropColumn('vehicle_vin_no');
            $table->longText('customer_infos')->after('customer_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_infos', function (Blueprint $table) {
            $table->dropColumn('customer_infos'); 
        });
    }
}
