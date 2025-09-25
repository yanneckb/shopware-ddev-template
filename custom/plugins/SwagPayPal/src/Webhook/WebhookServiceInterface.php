<?php declare(strict_types=1);
/*
 * (c) shopware AG <info@shopware.com>
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Swag\PayPal\Webhook;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\Log\Package;
use Shopware\PayPalSDK\Struct\V1\Webhook\Event;

#[Package('checkout')]
interface WebhookServiceInterface
{
    public function getStatus(?string $salesChannelId): string;

    public function registerWebhook(?string $salesChannelId): string;

    public function deregisterWebhook(?string $salesChannelId): string;

    public function executeWebhook(Event $webhook, Context $context): void;
}
