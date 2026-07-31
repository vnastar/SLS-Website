<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('short_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('alias', 32)->unique()->index();
            $table->text('destination_url');
            $table->string('title')->nullable();
            $table->enum('status', ['active', 'paused', 'expired', 'blocked'])->default('active')->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->string('password')->nullable();
            $table->unsignedBigInteger('click_count')->default(0)->index();
            $table->json('utm_params')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('short_links');
    }
};
